import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from 'generated/prisma/client';
import { AuthProvider, OnboardingStatus, Status } from 'generated/prisma/enums';
import { OAuth2Client } from 'google-auth-library';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { PrismaService } from 'src/shared/infrastructure/modules/prisma/prisma.service';
import { UtilityService } from 'src/shared/infrastructure/modules/utilities/utility.service';

import { MailService } from '@/modules/integrations/mail/mail.service';
import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';

import { AuthContextService } from './auth-context.service';
import {
    AppleAuthDto,
    GoogleAuthDto,
    LoginDto,
    LogoutDto,
    RefreshDto,
    RequestPasswordResetDto,
    ResendVerificationEmailDto,
    ResetPasswordDto,
    SignupDto,
    VerifyEmailDto,
} from './dto';
import { AuthResponse } from './types';

@Injectable()
export class AuthService {
    private googleClient: OAuth2Client;
    private appleJwks: ReturnType<typeof createRemoteJWKSet>;

    constructor(
        private readonly prisma: PrismaService,
        private readonly utility: UtilityService,
        private readonly jwt: JwtService,
        private readonly mailer: MailService,
        private readonly logger: Logger,
        private readonly authContextService: AuthContextService
    ) {
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        this.appleJwks = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));
    }

    async signup(dto: SignupDto): Promise<{ success: true; email: string }> {
        const email = dto.email.toLowerCase().trim();

        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new AppException({
                status: HttpStatus.CONFLICT,
                code: ErrorCode.EMAIL_ALREADY_IN_USE,
                message: 'Email already in use',
            });
        }

        const passwordHash = await this.utility.hash(dto.password);

        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    display_name: dto.displayName ?? null,
                },
            });

            await tx.credentialSecret.create({
                data: {
                    user_id: user.id,
                    password_hash: passwordHash,
                },
            });

            await tx.authIdentity.create({
                data: {
                    user_id: user.id,
                    provider: AuthProvider.PASSWORD,
                    provider_subject: user.id,
                },
            });

            await tx.owner.create({
                data: {
                    user_id: user.id,
                    status: Status.PENDING,
                },
            });
            return user;
        });

        const verificationCode = this.generateVerificationCode();
        const verificationCodeHash = this.utility.hashSha256(verificationCode);

        await this.prisma.$transaction([
            this.prisma.emailVerificationToken.deleteMany({
                where: {
                    user_id: result.id,
                    used_at: null,
                    expires_at: {
                        gt: new Date(),
                    },
                },
            }),
            this.prisma.emailVerificationToken.create({
                data: {
                    user_id: result.id,
                    code_hash: verificationCodeHash,
                    expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
                },
            }),
        ]);

        try {
            const verificationLink = `${process.env.QUARRY_INC_FRONTEND_URL}/account/sign-up/verify-email?email=${encodeURIComponent(result.email)}`;
            await this.mailer.sendTemplateEmail({
                template: 'verifyEmail',
                to: result.email,
                context: {
                    verifyEmailLink: verificationLink,
                    userName: result.display_name ?? 'User',
                    companyName: 'Quarry.ink',
                    codeDigits: verificationCode.toString().split(''),
                    expiryTime: '1 hour',
                },
            });
        } catch (error) {
            this.logger.error('Failed to send email verification email', error);
        }

        return {
            success: true,
            email: result.email,
        };
    }

    async login(dto: LoginDto): Promise<AuthResponse> {
        const email = dto.email.toLowerCase().trim();

        const user = await this.prisma.user.findUnique({ where: { email }, include: { credential_secret: true } });
        if (!user) {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.INVALID_CREDENTIALS,
                message: 'Invalid credentials',
            });
        }

        const credential = user.credential_secret;

        if (!credential) {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.INVALID_CREDENTIALS,
                message: 'Invalid credentials',
            });
        }

        const passwordValid = await this.utility.compareHash(dto.password, credential.password_hash);

        if (!passwordValid) {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.INVALID_CREDENTIALS,
                message: 'Invalid credentials',
            });
        }

        if (!user.email_verified) {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.EMAIL_NOT_VERIFIED,
                message: 'Email not verified',
            });
        }

        const session = await this.createSession(user.id);

        const { credential_secret: _credential_secret, ...safeUser } = user;

        return {
            user: safeUser,
            ...session,
        };
    }

    async refresh(dto: RefreshDto): Promise<AuthResponse> {
        const session = await this.rotateSession(dto.refreshToken);

        return { user: session.user, accessToken: session.accessToken, refreshToken: session.refreshToken };
    }

    async logout(dto: LogoutDto) {
        const refreshTokenHash = this.utility.hashSha256(dto.refreshToken);

        await this.prisma.refreshSession.updateMany({
            where: {
                token_hash: refreshTokenHash,
                revoked_at: null,
            },
            data: {
                revoked_at: new Date(),
            },
        });

        return { success: true };
    }

    async requestPasswordReset(dto: RequestPasswordResetDto) {
        const email = dto.email.toLowerCase().trim();

        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { success: true };
        }

        const resetToken = this.utility.randomBytes(32);
        const resetTokenHash = this.utility.hashSha256(resetToken);

        await this.prisma.$transaction([
            this.prisma.passwordResetToken.updateMany({
                where: {
                    user_id: user.id,
                    used_at: null,
                    expires_at: {
                        gt: new Date(),
                    },
                },
                data: { used_at: new Date() },
            }),
            this.prisma.passwordResetToken.create({
                data: {
                    user_id: user.id,
                    token_hash: resetTokenHash,
                    expires_at: new Date(Date.now() + 60 * 60 * 1000),
                },
            }),
        ]);

        const resetLink = `${process.env.QUARRY_INC_FRONTEND_URL}/account/reset-password/sent?token=${resetToken}`;

        try {
            await this.mailer.sendTemplateEmail({
                template: 'requestResetPassword',
                to: user.email,
                context: {
                    userName: user.display_name ?? 'User',
                    resetLink,
                    expiryTime: '1 hour',
                    companyName: 'Quarry.ink',
                },
            });
        } catch (error) {
            this.logger.error('Failed to send password reset email', error);
        }

        return { success: true };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const resetTokenHash = this.utility.hashSha256(dto.token);
        const tokenRecord = await this.prisma.passwordResetToken.findUnique({
            where: { token_hash: resetTokenHash },
        });

        if (!tokenRecord || tokenRecord.expires_at < new Date() || tokenRecord.used_at) {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.INVALID_RESET_TOKEN,
                message: 'Invalid or expired reset token',
            });
        }

        const passwordHash = await this.utility.hash(dto.newPassword);

        await this.prisma.$transaction([
            this.prisma.credentialSecret.update({
                where: { user_id: tokenRecord.user_id },
                data: { password_hash: passwordHash },
            }),
            this.prisma.passwordResetToken.update({
                where: { id: tokenRecord.id },
                data: { used_at: new Date() },
            }),
            this.prisma.refreshSession.updateMany({
                where: {
                    user_id: tokenRecord.user_id,
                    revoked_at: null,
                },
                data: {
                    revoked_at: new Date(),
                },
            }),
        ]);

        const user = await this.prisma.user.findUnique({ where: { id: tokenRecord.user_id } });

        try {
            if (user) {
                const loginLink = `${process.env.QUARRY_INC_FRONTEND_URL}/account`;
                await this.mailer.sendTemplateEmail({
                    template: 'successResetPassword',
                    to: user.email,
                    context: {
                        companyName: 'Quarry.ink',
                        userName: user.display_name ?? 'User',
                        loginLink,
                        supportEmail: process.env.SMTP_USER as string,
                    },
                });
            }
        } catch (error) {
            this.logger.error('Failed to send password reset email', error);
        }

        return { success: true };
    }

    async me(userId: string): Promise<AuthResponse> {
        if (!userId) {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.INVALID_CREDENTIALS,
                message: 'Invalid credentials',
            });
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.USER_NOT_FOUND,
                message: 'User not found',
            });
        }

        return { user };
    }

    async google(dto: GoogleAuthDto): Promise<AuthResponse> {
        const ticket = await this.googleClient.verifyIdToken({
            idToken: dto.idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload?.sub || !payload.email) {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.INVALID_AUTH_TOKEN,
                message: 'Invalid Google token',
            });
        }

        const email = payload.email.toLowerCase().trim();
        const providerSubject = payload.sub;
        const emailVerified = payload.email_verified === true;

        const identity = await this.prisma.authIdentity.findUnique({
            where: {
                provider_provider_subject: {
                    provider: AuthProvider.GOOGLE,
                    provider_subject: providerSubject,
                },
            },
            include: {
                user: true,
            },
        });

        if (identity) {
            const updatedUser = await this.prisma.$transaction(async (tx) => {
                const updatedUser = await tx.user.update({
                    where: { id: identity.user_id },
                    data: {
                        display_name: identity.user.display_name ?? payload.name ?? null,
                        avatar_url: identity.user.avatar_url ?? payload.picture ?? null,
                        email_verified: identity.user.email_verified || emailVerified,
                    },
                });

                if (updatedUser.email_verified) {
                    await this.activateUserWorkspace(tx, updatedUser.id);
                }

                return updatedUser;
            });

            const session = await this.createSession(updatedUser.id);

            return {
                user: updatedUser,
                ...session,
            };
        }

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            const updatedUser = await this.prisma.$transaction(async (tx) => {
                await tx.authIdentity.create({
                    data: {
                        user_id: existingUser.id,
                        provider: AuthProvider.GOOGLE,
                        provider_subject: providerSubject,
                    },
                });

                const updatedUser = await tx.user.update({
                    where: { id: existingUser.id },
                    data: {
                        display_name: existingUser.display_name ?? payload.name ?? null,
                        avatar_url: existingUser.avatar_url ?? payload.picture ?? null,
                        email_verified: existingUser.email_verified || emailVerified,
                    },
                });

                if (updatedUser.email_verified) {
                    await this.activateUserWorkspace(tx, updatedUser.id);
                }

                return updatedUser;
            });

            const session = await this.createSession(updatedUser.id);

            return {
                user: updatedUser,
                ...session,
            };
        }

        if (dto.mode === 'login_only') {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.ACCOUNT_NOT_FOUND,
                message: 'No account found for this email. Please sign up first.',
            });
        }

        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    display_name: payload.name ?? null,
                    avatar_url: payload.picture ?? null,
                    email_verified: emailVerified,
                },
            });

            await tx.owner.create({
                data: {
                    user_id: user.id,
                    status: emailVerified ? Status.ACTIVE : Status.PENDING,
                },
            });

            await tx.authIdentity.create({
                data: {
                    user_id: user.id,
                    provider: AuthProvider.GOOGLE,
                    provider_subject: providerSubject,
                },
            });

            if (emailVerified) {
                await this.activateUserWorkspace(tx, user.id);
            }

            return user;
        });

        const session = await this.createSession(result.id);

        return {
            user: result,
            ...session,
        };
    }

    async apple(dto: AppleAuthDto): Promise<AuthResponse> {
        if (!dto.idToken) {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.INVALID_AUTH_TOKEN,
                message: 'Apple ID token is required',
            });
        }

        const { payload } = await jwtVerify(dto.idToken, this.appleJwks, {
            issuer: 'https://appleid.apple.com',
            audience: process.env.APPLE_CLIENT_ID!,
        }).catch(() => {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.INVALID_AUTH_TOKEN,
                message: 'Invalid Apple ID token',
            });
        });

        if (!payload?.sub) {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.INVALID_AUTH_TOKEN,
                message: 'Invalid Apple ID token payload',
            });
        }

        const email = typeof payload.email === 'string' ? payload.email.toLowerCase().trim() : null;
        const providerSubject = payload.sub;
        const emailVerified = payload.email_verified === true || payload.email_verified === 'true';

        if (!email || !providerSubject) {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.INVALID_AUTH_TOKEN,
                message: 'Apple ID token must contain email and sub claims',
            });
        }

        const identity = await this.prisma.authIdentity.findUnique({
            where: {
                provider_provider_subject: {
                    provider: AuthProvider.APPLE,
                    provider_subject: providerSubject,
                },
            },
            include: {
                user: true,
            },
        });

        if (identity) {
            const session = await this.createSession(identity.user_id);

            return {
                ...session,
                user: identity.user,
            };
        }

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            await this.prisma.authIdentity.create({
                data: {
                    user_id: existingUser.id,
                    provider: AuthProvider.APPLE,
                    provider_subject: providerSubject,
                },
            });

            const session = await this.createSession(existingUser.id);
            return {
                user: existingUser,
                ...session,
            };
        }

        if (dto.mode === 'login_only') {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.ACCOUNT_NOT_FOUND,
                message: 'No account found for this email. Please sign up first.',
            });
        }

        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    display_name: null,
                    avatar_url: null,
                    email_verified: emailVerified,
                },
            });

            await tx.authIdentity.create({
                data: {
                    user_id: user.id,
                    provider: AuthProvider.APPLE,
                    provider_subject: providerSubject,
                },
            });

            return user;
        });

        const session = await this.createSession(result.id);
        return {
            user: result,
            ...session,
        };
    }

    async verifyEmail(dto: VerifyEmailDto): Promise<AuthResponse> {
        const email = dto.email.toLowerCase().trim();
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.INVALID_VERIFICATION_CODE,
                message: 'Invalid verification token',
            });
        }
        const codeHash = this.utility.hashSha256(dto.code);

        const verificationToken = await this.prisma.emailVerificationToken.findFirst({
            where: {
                user_id: user.id,
                code_hash: codeHash,
                expires_at: {
                    gt: new Date(),
                },
                used_at: null,
            },
        });

        if (!verificationToken) {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.INVALID_VERIFICATION_CODE,
                message: 'Invalid or expired verification token',
            });
        }

        const updatedUser = await this.prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: { email_verified: true },
            });

            await tx.emailVerificationToken.update({
                where: { id: verificationToken.id },
                data: { used_at: new Date() },
            });

            await this.activateUserWorkspace(tx, user.id);

            return updatedUser;
        });

        const session = await this.createSession(user.id);

        return { user: updatedUser, ...session };
    }

    async resendVerificationEmail(dto: ResendVerificationEmailDto): Promise<{ success: boolean }> {
        const email = dto.email.toLowerCase().trim();

        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { success: true };
        }

        if (user.email_verified) {
            return { success: true };
        }

        const verificationCode = this.generateVerificationCode();
        const verificationCodeHash = this.utility.hashSha256(verificationCode);

        await this.prisma.$transaction([
            this.prisma.emailVerificationToken.updateMany({
                where: {
                    user_id: user.id,
                    used_at: null,
                    expires_at: {
                        gt: new Date(),
                    },
                },
                data: {
                    used_at: new Date(),
                },
            }),
            this.prisma.emailVerificationToken.create({
                data: {
                    user_id: user.id,
                    code_hash: verificationCodeHash,
                    expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
                },
            }),
        ]);

        try {
            const verificationLink = `${process.env.QUARRY_INC_FRONTEND_URL}/account/sign-up/verify-email?email=${encodeURIComponent(user.email)}`;
            await this.mailer.sendTemplateEmail({
                template: 'verifyEmail',
                to: user.email,
                context: {
                    verifyEmailLink: verificationLink,
                    userName: user.display_name ?? 'User',
                    companyName: 'Quarry.ink',
                    codeDigits: verificationCode.toString().split(''),
                    expiryTime: '1 hour',
                },
            });
        } catch (error) {
            this.logger.error('Failed to send email verification email', error);
        }

        return { success: true };
    }
    async context(userId: string) {
        const { user, owner, site } = await this.authContextService.getUserOwnerSiteOrThrow(userId);

        return {
            user,
            owner,
            site,
        };
    }
    // --- Helper methods ---
    private async createSession(userId: string) {
        const now = Date.now();
        const owner = await this.prisma.owner.findUnique({
            where: { user_id: userId },
            select: { role: true },
        });
        const role = owner?.role ?? 'OWNER';
        const accessToken = await this.jwt.signAsync({ sub: userId, role });

        const refreshToken = this.utility.randomBytes(64);
        const refreshTokenHash = this.utility.hashSha256(refreshToken);

        await this.prisma.refreshSession.create({
            data: {
                user_id: userId,
                token_hash: refreshTokenHash,
                expires_at: new Date(now + 30 * 24 * 60 * 60 * 1000),
            },
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    private async rotateSession(refreshToken: string) {
        const refreshTokenHash = this.utility.hashSha256(refreshToken);

        const session = await this.prisma.refreshSession.findUnique({
            where: { token_hash: refreshTokenHash },
            include: { user: true },
        });

        if (!session || session.expires_at < new Date() || session.revoked_at) {
            throw new AppException({
                status: HttpStatus.UNAUTHORIZED,
                code: ErrorCode.INVALID_REFRESH_TOKEN,
                message: 'Invalid or expired refresh token',
            });
        }

        const now = new Date();

        const newRefreshToken = this.utility.randomBytes(64);
        const newRefreshTokenHash = this.utility.hashSha256(newRefreshToken);

        await this.prisma.$transaction([
            this.prisma.refreshSession.update({
                where: { id: session.id },
                data: { revoked_at: now },
            }),
            this.prisma.refreshSession.create({
                data: {
                    user_id: session.user_id,
                    token_hash: newRefreshTokenHash,
                    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                },
            }),
        ]);

        const owner = await this.prisma.owner.findUnique({
            where: { user_id: session.user_id },
            select: { role: true },
        });
        const role = owner?.role ?? 'OWNER';

        return {
            accessToken: await this.jwt.signAsync({ sub: session.user_id, role }),
            refreshToken: newRefreshToken,
            user: session.user,
        };
    }

    private generateVerificationCode(): string {
        const value = parseInt(this.utility.randomBytes(4), 16) % 900000;
        return String(value + 100000);
    }

    private async activateUserWorkspace(tx: Prisma.TransactionClient, userId: string) {
        const owner = await tx.owner.update({
            where: { user_id: userId },
            data: { status: Status.ACTIVE },
        });

        const site = await tx.site.upsert({
            where: { owner_id: owner.id },
            update: {},
            create: {
                owner_id: owner.id,
                status: Status.PENDING,
                onboarding_status: OnboardingStatus.ONBOARDING_STARTED,
            },
        });

        await tx.siteBilling.upsert({
            where: { site_id: site.id },
            update: {},
            create: {
                site_id: site.id,
            },
        });

        await tx.siteSettings.upsert({
            where: { site_id: site.id },
            update: {},
            create: {
                site_id: site.id,
            },
        });

        await tx.siteSeo.upsert({
            where: { site_id: site.id },
            update: {},
            create: {
                site_id: site.id,
            },
        });

        return owner;
    }
}

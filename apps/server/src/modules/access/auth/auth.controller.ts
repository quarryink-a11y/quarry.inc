import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtPayload } from 'src/shared/types';

import { ApiErrorResponseDto } from '@/shared/errors/api-error-response.dto';

import { CurrentUser, IsPublic } from '../permissions/decorators';
import { AuthService } from './auth.service';
import {
    AppleAuthDto,
    AuthContextResponseDto,
    AuthResponseDto,
    GoogleAuthDto,
    LoginDto,
    LogoutDto,
    RefreshDto,
    RequestPasswordResetDto,
    ResendVerificationEmailDto,
    ResetPasswordDto,
    SignupDto,
    SignupResponseDto,
    SuccessResponseDto,
    VerifyEmailDto,
} from './dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @HttpCode(200)
    @IsPublic()
    @ApiOperation({ summary: 'Register a new user' })
    @ApiOkResponse({ type: SignupResponseDto })
    @ApiBadRequestResponse({ type: ApiErrorResponseDto })
    @ApiConflictResponse({ type: ApiErrorResponseDto })
    signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post('login')
    @HttpCode(200)
    @IsPublic()
    @ApiOperation({ summary: 'Login a user' })
    @ApiOkResponse({ type: AuthResponseDto })
    @ApiBadRequestResponse({ type: ApiErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('refresh')
    @HttpCode(200)
    @IsPublic()
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiOkResponse({ type: AuthResponseDto })
    @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
    refresh(@Body() dto: RefreshDto) {
        return this.authService.refresh(dto);
    }

    @Post('logout')
    @HttpCode(200)
    @IsPublic()
    @ApiOperation({ summary: 'Logout a user' })
    @ApiOkResponse({ type: SuccessResponseDto })
    @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
    logout(@Body() dto: LogoutDto) {
        return this.authService.logout(dto);
    }

    @Post('request-password-reset')
    @HttpCode(200)
    @IsPublic()
    @ApiOperation({ summary: 'Request password reset' })
    @ApiOkResponse({ type: SuccessResponseDto })
    @ApiBadRequestResponse({ type: ApiErrorResponseDto })
    requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
        return this.authService.requestPasswordReset(dto);
    }

    @Post('reset-password')
    @HttpCode(200)
    @IsPublic()
    @ApiOperation({ summary: 'Reset password' })
    @ApiOkResponse({ type: SuccessResponseDto })
    @ApiBadRequestResponse({ type: ApiErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }

    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user info' })
    @ApiOkResponse({ type: AuthResponseDto })
    @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
    me(@CurrentUser() user: JwtPayload) {
        return this.authService.me(user.sub);
    }

    @Post('google')
    @HttpCode(200)
    @IsPublic()
    @ApiOperation({ summary: 'Authenticate with Google' })
    @ApiOkResponse({ type: AuthResponseDto })
    @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
    google(@Body() dto: GoogleAuthDto) {
        return this.authService.google(dto);
    }

    @Post('apple')
    @HttpCode(200)
    @IsPublic()
    @ApiOperation({ summary: 'Authenticate with Apple' })
    @ApiOkResponse({ type: AuthResponseDto })
    @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
    apple(@Body() dto: AppleAuthDto) {
        return this.authService.apple(dto);
    }

    @Post('verify-email')
    @HttpCode(200)
    @IsPublic()
    @ApiOperation({ summary: 'Verify email address' })
    @ApiOkResponse({ type: AuthResponseDto })
    @ApiBadRequestResponse({ type: ApiErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
    verifyEmail(@Body() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(dto);
    }

    @Post('resend-verification-email')
    @HttpCode(200)
    @IsPublic()
    @ApiOperation({ summary: 'Resend verification email' })
    @ApiOkResponse({ type: SuccessResponseDto })
    @ApiBadRequestResponse({ type: ApiErrorResponseDto })
    resendVerificationEmail(@Body() dto: ResendVerificationEmailDto) {
        return this.authService.resendVerificationEmail(dto);
    }

    @Get('context')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user context' })
    @ApiOkResponse({ type: AuthContextResponseDto })
    @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
    context(@CurrentUser() user: JwtPayload) {
        return this.authService.context(user.sub);
    }
}

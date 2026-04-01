import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OnboardingStatus, Role, Status, TemplateKind } from 'generated/prisma/enums';

import { AuthUserDto } from './auth-user.dto';

class OwnerContextDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    user_id: string;

    @ApiProperty({ enum: Role })
    role: Role;

    @ApiPropertyOptional({ nullable: true })
    first_name: string | null;

    @ApiPropertyOptional({ nullable: true })
    last_name: string | null;

    @ApiPropertyOptional({ nullable: true })
    phone: string | null;

    @ApiProperty({ enum: Status })
    status: Status;

    @ApiProperty({ type: 'string', format: 'date-time' })
    created_at: Date;

    @ApiProperty({ type: 'string', format: 'date-time' })
    updated_at: Date;
}

class SiteContextDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    owner_id: string;

    @ApiProperty({ enum: Status })
    status: Status;

    @ApiProperty({ type: [String] })
    completed_modules: string[];

    @ApiProperty({ enum: OnboardingStatus })
    onboarding_status: OnboardingStatus;

    @ApiPropertyOptional({ enum: TemplateKind, nullable: true })
    kind: TemplateKind | null;

    @ApiProperty({ type: 'string', format: 'date-time' })
    created_at: Date;

    @ApiProperty({ type: 'string', format: 'date-time' })
    updated_at: Date;
}

export class AuthContextResponseDto {
    @ApiProperty({ type: AuthUserDto })
    user: AuthUserDto;

    @ApiProperty({ type: OwnerContextDto })
    owner: OwnerContextDto;

    @ApiProperty({ type: SiteContextDto })
    site: SiteContextDto;
}

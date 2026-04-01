import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminPermission, Role } from 'generated/prisma/enums';

export class AdminResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    site_id: string;

    @ApiPropertyOptional({ nullable: true })
    first_name?: string | null;

    @ApiPropertyOptional({ nullable: true })
    last_name?: string | null;

    @ApiProperty()
    email: string;

    @ApiPropertyOptional({ nullable: true })
    phone_code?: string | null;

    @ApiPropertyOptional({ nullable: true })
    phone_country_code?: string | null;

    @ApiPropertyOptional({ nullable: true })
    phone_number?: string | null;

    @ApiProperty({ enum: Role })
    role: Role;

    @ApiProperty({ enum: AdminPermission, isArray: true })
    access_modules: AdminPermission[];

    @ApiProperty()
    created_at: string;

    @ApiProperty()
    updated_at: string;
}

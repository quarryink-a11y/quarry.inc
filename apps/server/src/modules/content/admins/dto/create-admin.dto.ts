import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { AdminPermission, Role } from 'generated/prisma/enums';

export class CreateAdminDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(8)
    password: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    first_name?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    last_name?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phone_code?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phone_country_code?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phone_number?: string;

    @ApiPropertyOptional({ enum: Role, default: Role.ADMIN })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    @ApiPropertyOptional({ enum: AdminPermission, isArray: true, default: [] })
    @IsArray()
    @IsEnum(AdminPermission, { each: true })
    @IsOptional()
    access_modules?: AdminPermission[];
}

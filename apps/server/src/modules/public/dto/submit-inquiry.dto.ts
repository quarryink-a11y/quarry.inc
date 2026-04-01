import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { ReferralSource } from 'generated/prisma/enums';

export class SubmitInquiryDto {
    @ApiProperty()
    @IsString()
    first_name: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    last_name?: string;

    @ApiProperty()
    @IsEmail()
    client_email: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    client_phone?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    idea_description?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    placement?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    size_value?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    size_unit?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    preferred_date?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    city?: string;

    @ApiPropertyOptional({ enum: ReferralSource, enumName: 'ReferralSource' })
    @IsEnum(ReferralSource)
    @IsOptional()
    referral_source?: ReferralSource;

    @ApiPropertyOptional({ type: [String] })
    @IsArray()
    @IsUrl({}, { each: true })
    @IsOptional()
    inspiration_urls?: string[];
}

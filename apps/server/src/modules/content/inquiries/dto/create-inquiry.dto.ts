import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsISO8601, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { ReferralSource } from 'generated/prisma/enums';

export class CreateInquiryDto {
    @ApiProperty()
    @IsEmail()
    client_email: string;

    @ApiProperty()
    @IsString()
    client_phone: string;

    @ApiProperty()
    @IsString()
    first_name: string;

    @ApiProperty()
    @IsString()
    last_name: string;

    @ApiProperty()
    @IsString()
    idea_description: string;

    @ApiProperty()
    @IsString()
    placement: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    size_value: number;

    @ApiProperty()
    @IsString()
    size_unit: string;

    @ApiProperty({ description: 'ISO 8601 date string' })
    @IsISO8601()
    preferred_date: string;

    @ApiProperty()
    @IsString()
    city: string;

    @ApiProperty({ enum: ReferralSource, enumName: 'ReferralSource' })
    @IsEnum(ReferralSource)
    referral_source: ReferralSource;

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsUrl({}, { each: true })
    inspiration_urls: string[];

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    final_price?: number;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InquiryStatus } from 'generated/prisma/enums';

export class InquiryResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    site_id: string;

    @ApiProperty()
    client_email: string;

    @ApiProperty()
    client_phone: string;

    @ApiProperty()
    first_name: string;

    @ApiProperty()
    last_name: string;

    @ApiProperty()
    idea_description: string;

    @ApiProperty()
    placement: string;

    @ApiProperty()
    size_value: number;

    @ApiProperty()
    size_unit: string;

    @ApiProperty()
    preferred_date: string;

    @ApiProperty()
    city: string;

    @ApiProperty()
    referral_source: string;

    @ApiProperty({ type: [String] })
    inspiration_urls: string[];

    @ApiPropertyOptional({ nullable: true })
    final_price: number | null;

    @ApiProperty({ enum: InquiryStatus })
    status: InquiryStatus;

    @ApiProperty()
    created_at: string;

    @ApiProperty()
    updated_at: string;
}

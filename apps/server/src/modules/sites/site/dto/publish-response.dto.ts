import { ApiProperty } from '@nestjs/swagger';

export class PublishCountsDto {
    @ApiProperty()
    portfolios: number;

    @ApiProperty()
    designs: number;

    @ApiProperty()
    events: number;

    @ApiProperty()
    reviews: number;

    @ApiProperty()
    catalogs: number;

    @ApiProperty()
    faq_categories: number;

    @ApiProperty()
    booking_steps: number;
}

export class PublishResponseDto {
    @ApiProperty()
    published_at: string;

    @ApiProperty({ type: PublishCountsDto })
    counts: PublishCountsDto;
}

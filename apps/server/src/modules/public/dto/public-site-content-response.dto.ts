import { ApiProperty } from '@nestjs/swagger';

import { BookingStepResponseDto } from '@/modules/content/booking-steps/dto/booking-step-response.dto';
import { CatalogResponseDto } from '@/modules/content/catalogs/entities/catalog.entity';
import { DesignResponseDto } from '@/modules/content/designs/dto/design-response.dto';
import { EventResponseDto } from '@/modules/content/events/dto/event-response.dto';
import { FaqCategoryResponseDto } from '@/modules/content/faq/dto/faq-response.dto';
import { PortfolioResponseDto } from '@/modules/content/portfolios/dto/portfolio-response.dto';
import { ReviewResponseDto } from '@/modules/content/reviews/dto/review-response.dto';

export class PublicSiteContentResponseDto {
    @ApiProperty({ type: [PortfolioResponseDto] })
    portfolios: PortfolioResponseDto[];

    @ApiProperty({ type: [DesignResponseDto] })
    designs: DesignResponseDto[];

    @ApiProperty({ type: [EventResponseDto] })
    events: EventResponseDto[];

    @ApiProperty({ type: [ReviewResponseDto] })
    reviews: ReviewResponseDto[];

    @ApiProperty({ type: [CatalogResponseDto] })
    catalogs: CatalogResponseDto[];

    @ApiProperty({ type: [FaqCategoryResponseDto] })
    faq_categories: FaqCategoryResponseDto[];

    @ApiProperty({ type: [BookingStepResponseDto] })
    booking_steps: BookingStepResponseDto[];
}

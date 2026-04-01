import { ApiProperty } from '@nestjs/swagger';
import { InquiryStatus, OrderStatus, ReferralSource, TrafficSource } from 'generated/prisma/enums';

class DateCount {
    @ApiProperty()
    date: string;

    @ApiProperty()
    count: number;
}

class TrafficSourceCount {
    @ApiProperty({ enum: TrafficSource, enumName: 'TrafficSource' })
    source: TrafficSource;

    @ApiProperty()
    count: number;
}

class ReferralSourceCount {
    @ApiProperty({ enum: ReferralSource, enumName: 'ReferralSource' })
    source: ReferralSource;

    @ApiProperty()
    count: number;
}

class InquiryStatusCount {
    @ApiProperty({ enum: InquiryStatus, enumName: 'InquiryStatus' })
    status: InquiryStatus;

    @ApiProperty()
    count: number;
}

class OrderStatusCount {
    @ApiProperty({ enum: OrderStatus, enumName: 'OrderStatus' })
    status: OrderStatus;

    @ApiProperty()
    count: number;
}

class VisitsAnalytics {
    @ApiProperty()
    total: number;

    @ApiProperty()
    unique_visitors: number;

    @ApiProperty({ type: [TrafficSourceCount] })
    by_source: TrafficSourceCount[];

    @ApiProperty({ type: [DateCount] })
    by_date: DateCount[];
}

class InquiriesAnalytics {
    @ApiProperty()
    total: number;

    @ApiProperty({ type: [InquiryStatusCount] })
    by_status: InquiryStatusCount[];

    @ApiProperty({ type: [DateCount] })
    by_date: DateCount[];

    @ApiProperty({ type: [ReferralSourceCount] })
    by_referral_source: ReferralSourceCount[];
}

class OrdersAnalytics {
    @ApiProperty()
    total: number;

    @ApiProperty()
    revenue: number;

    @ApiProperty({ type: [OrderStatusCount] })
    by_status: OrderStatusCount[];

    @ApiProperty({ type: [DateCount] })
    by_date: DateCount[];
}

class TopReturningClient {
    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    inquiry_count: number;
}

class ClientInsightsDto {
    @ApiProperty()
    total_clients: number;

    @ApiProperty()
    new_clients: number;

    @ApiProperty()
    returning_clients: number;

    @ApiProperty()
    return_rate: number;

    @ApiProperty({ type: [TopReturningClient] })
    top_returning: TopReturningClient[];
}

class ReferralSourceItem {
    @ApiProperty()
    source: string;

    @ApiProperty()
    count: number;

    @ApiProperty()
    percentage: number;
}

class SourceConversionItem {
    @ApiProperty()
    source: string;

    @ApiProperty()
    total_inquiries: number;

    @ApiProperty()
    completed: number;

    @ApiProperty()
    revenue: number;

    @ApiProperty()
    conversion_rate: number;
}

export class AnalyticsDashboardResponseDto {
    @ApiProperty({ type: VisitsAnalytics })
    visits: VisitsAnalytics;

    @ApiProperty({ type: InquiriesAnalytics })
    inquiries: InquiriesAnalytics;

    @ApiProperty({ type: OrdersAnalytics })
    orders: OrdersAnalytics;

    @ApiProperty({ type: ClientInsightsDto })
    client_insights: ClientInsightsDto;

    @ApiProperty({ type: [ReferralSourceItem] })
    referral_sources: ReferralSourceItem[];

    @ApiProperty({ type: [SourceConversionItem] })
    source_conversions: SourceConversionItem[];
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BillingStatus, SubscriptionPlan } from 'generated/prisma/enums';

class BillingDataDto {
    @ApiPropertyOptional({ enum: BillingStatus, nullable: true })
    billing_status: BillingStatus | null;

    @ApiPropertyOptional({ enum: SubscriptionPlan, nullable: true })
    plan_code: SubscriptionPlan | null;

    @ApiPropertyOptional({ nullable: true })
    subscription_status: string | null;

    @ApiPropertyOptional({ type: Date, nullable: true })
    trial_ends_at: Date | null;

    @ApiPropertyOptional({ type: Date, nullable: true })
    current_period_end: Date | null;

    @ApiPropertyOptional({ type: Date, nullable: true })
    canceled_at: Date | null;

    @ApiPropertyOptional({ nullable: true })
    stripe_connect_account_id: string | null;
}

export class BillingStatusResponseDto {
    @ApiProperty({ type: BillingDataDto, nullable: true })
    billing: BillingDataDto | null;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BillingStatus, SubscriptionPlan } from 'generated/prisma/enums';

class SetupIntentDataDto {
    @ApiProperty({ example: 'seti_xxx_secret_xxx' })
    clientSecret: string;

    @ApiProperty({ example: 'cus_xxx' })
    customerId: string;
}

class SiteBillingDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    site_id: string;

    @ApiPropertyOptional({ nullable: true })
    stripe_customer_id: string | null;

    @ApiPropertyOptional({ nullable: true })
    stripe_subscription_id: string | null;

    @ApiPropertyOptional({ nullable: true })
    stripe_connect_account_id: string | null;

    @ApiPropertyOptional({ nullable: true })
    stripe_payment_method_id: string | null;

    @ApiPropertyOptional({ enum: BillingStatus, nullable: true })
    billing_status: BillingStatus | null;

    @ApiPropertyOptional({ enum: SubscriptionPlan, nullable: true })
    plan_code: SubscriptionPlan | null;

    @ApiPropertyOptional({ nullable: true })
    subscription_status: string | null;

    @ApiPropertyOptional({ nullable: true })
    billing_email: string | null;

    @ApiPropertyOptional({ type: Date, nullable: true })
    trial_ends_at: Date | null;

    @ApiPropertyOptional({ type: Date, nullable: true })
    current_period_end: Date | null;

    @ApiPropertyOptional({ type: Date, nullable: true })
    canceled_at: Date | null;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;
}

export class BillingCreateSetupIntentResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: () => SetupIntentDataDto })
    setupIntent: SetupIntentDataDto;

    @ApiProperty({ type: () => SiteBillingDto })
    billing: SiteBillingDto;
}

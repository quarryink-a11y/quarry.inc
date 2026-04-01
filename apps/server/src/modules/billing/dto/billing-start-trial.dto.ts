import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { SubscriptionPlan } from 'generated/prisma/enums';

export class BillingStartTrialDto {
    @ApiProperty({
        example: 'pm_1J2Y3Z4A5B6C7D8E9F0G',
        description: 'ID of the payment method to attach to the customer for the trial subscription',
    })
    @IsString()
    paymentMethodId: string;

    @ApiProperty({
        enum: SubscriptionPlan,
        enumName: 'SubscriptionPlan',
        example: SubscriptionPlan.BASIC,
        description: 'Plan code for which the setup intent is being created',
    })
    @IsEnum(SubscriptionPlan)
    planCode: SubscriptionPlan;

    @ApiPropertyOptional({
        example: 'user@example.com',
        description: 'Email address for billing purposes',
    })
    @IsOptional()
    @IsEmail()
    billingEmail?: string;
}

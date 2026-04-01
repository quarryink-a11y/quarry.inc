import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { SubscriptionPlan } from 'generated/prisma/enums';

export class BillingCreateSetupIntentDto {
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

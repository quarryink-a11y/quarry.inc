import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ConnectOnboardDto {
    @ApiProperty({ description: 'URL to redirect back after Stripe Connect onboarding' })
    @IsUrl({ require_tld: false })
    returnUrl: string;
}

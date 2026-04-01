import { ApiProperty } from '@nestjs/swagger';

class BillingStartTrialDataDto {
    @ApiProperty({ example: 'clx1234567890' })
    site_id: string;
}

export class BillingStartTrialResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: () => BillingStartTrialDataDto })
    data: BillingStartTrialDataDto;
}

import { ApiProperty } from '@nestjs/swagger';

export class OnboardingLaunchResponseDto {
    @ApiProperty({ example: true })
    success: boolean;
}

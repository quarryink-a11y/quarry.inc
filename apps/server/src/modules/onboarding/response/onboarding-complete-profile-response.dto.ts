import { ApiProperty } from '@nestjs/swagger';

export class OnboardingCompleteProfileResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'john-smith', description: 'Generated unique slug for the site' })
    slug: string;

    @ApiProperty({ example: 'quarry.ink/john-smith', description: 'Full site URL' })
    siteUrl: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class OnboardingCompleteProfileResponseDto {
    @ApiProperty()
    success: boolean;

    @ApiProperty({ example: 'john-smith' })
    slug: string;

    @ApiProperty({ example: 'localhost:3000/john-smith' })
    siteUrl: string;

    @ApiProperty()
    profile: {
        id: string;
        fullName: string;
        description: string | null;
        country: string | null;
        city: string | null;
        studioName: string | null;
        studioAddress: string | null;
        phone: string | null;
        email: string | null;
        photoUrl: string | null;
        studioPhotoUrl: string | null;
    };
}

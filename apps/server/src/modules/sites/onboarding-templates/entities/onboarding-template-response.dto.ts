import { ApiProperty } from '@nestjs/swagger';
import { ColorScheme, SiteSection } from 'generated/prisma/enums';

export class OnboardingTemplateResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ nullable: true })
    description: string | null;

    @ApiProperty({ nullable: true })
    preview_image: string | null;

    @ApiProperty({ type: [String] })
    preview_screens: string[];

    @ApiProperty()
    is_popular: boolean;

    @ApiProperty({ enum: ColorScheme, enumName: 'ColorScheme', nullable: true })
    color_scheme: ColorScheme | null;

    @ApiProperty()
    sort_order: number;

    @ApiProperty({
        enum: SiteSection,
        enumName: 'SiteSection',
        isArray: true,
    })
    sections: SiteSection[];
}

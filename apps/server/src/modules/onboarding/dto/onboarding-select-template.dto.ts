import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OnboardingSelectTemplateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The ID of the onboarding template to select',
        example: 'template_123',
    })
    onboardingTemplateId: string;
}

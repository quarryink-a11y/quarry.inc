import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IsPublic } from '@/modules/access/permissions/decorators';

import { OnboardingTemplateResponseDto } from './entities/onboarding-template-response.dto';
import { OnboardingTemplatesService } from './onboarding-templates.service';

@Controller('onboarding-templates')
@ApiTags('Onboarding Templates')
export class OnboardingTemplatesController {
    constructor(private readonly onboardingTemplatesService: OnboardingTemplatesService) {}

    @Get()
    @IsPublic()
    @ApiOperation({ summary: 'Get all onboarding templates' })
    @ApiResponse({
        description: 'List of onboarding templates',
        type: [OnboardingTemplateResponseDto],
        isArray: true,
    })
    findAll() {
        return this.onboardingTemplatesService.findAll();
    }
}

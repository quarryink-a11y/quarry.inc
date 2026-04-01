import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { IsPublic } from '@/modules/access/permissions/decorators';

import { OpenApiService } from './open-api.service';

@ApiExcludeController()
@IsPublic()
@Controller('open-api')
export class OpenApiController {
    constructor(private readonly openApiService: OpenApiService) {}

    @Get('openapi.json')
    getOpenApiDocument() {
        return this.openApiService.getDocument();
    }
}

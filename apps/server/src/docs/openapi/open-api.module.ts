import { Module } from '@nestjs/common';

import { OpenApiController } from './open-api.controller';
import { OpenApiService } from './open-api.service';

@Module({
    controllers: [OpenApiController],
    providers: [OpenApiService],
})
export class OpenApiModule {}

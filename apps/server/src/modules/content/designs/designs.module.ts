import { Module } from '@nestjs/common';

import { MediaModule } from '@/modules/media/media.module';

import { DesignsController } from './designs.controller';
import { DesignsService } from './designs.service';

@Module({
    imports: [MediaModule],
    controllers: [DesignsController],
    providers: [DesignsService],
})
export class DesignsModule {}

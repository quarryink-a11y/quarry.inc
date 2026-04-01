import { Module } from '@nestjs/common';

import { MediaModule } from '@/modules/media/media.module';

import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';

@Module({
    imports: [MediaModule],
    controllers: [PortfoliosController],
    providers: [PortfoliosService],
})
export class PortfoliosModule {}

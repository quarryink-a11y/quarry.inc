import { Module } from '@nestjs/common';

import { MediaModule } from '@/modules/media/media.module';

import { CatalogsController } from './catalogs.controller';
import { CatalogsService } from './catalogs.service';

@Module({
    imports: [MediaModule],
    controllers: [CatalogsController],
    providers: [CatalogsService],
})
export class CatalogsModule {}

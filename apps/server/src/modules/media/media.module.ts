import { Module } from '@nestjs/common';

import { AuthContextService } from '@/modules/access/auth/auth-context.service';
import { CloudinaryService } from '@/shared/infrastructure/modules/cloudinary/cloudinary.service';

import { MediaController } from './media.controller';
import { MediaScheduler } from './media.scheduler';
import { MediaService } from './media.service';

@Module({
    controllers: [MediaController],
    providers: [MediaService, CloudinaryService, AuthContextService, MediaScheduler],
    exports: [MediaService],
})
export class MediaModule {}

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { MediaService } from './media.service';

@Injectable()
export class MediaScheduler {
    private readonly logger = new Logger(MediaScheduler.name);

    constructor(private readonly mediaService: MediaService) {}

    @Cron(CronExpression.EVERY_HOUR)
    async handleCleanup() {
        const count = await this.mediaService.cleanupPendingMedia(24);
        if (count > 0) {
            this.logger.warn(`Cleaned up ${count} stale pending media files`);
        }
    }
}

import { Module } from '@nestjs/common';

import { TrackVisitsController } from './track-visits.controller';
import { TrackVisitsService } from './track-visits.service';

@Module({
    controllers: [TrackVisitsController],
    providers: [TrackVisitsService],
})
export class TrackVisitsModule {}

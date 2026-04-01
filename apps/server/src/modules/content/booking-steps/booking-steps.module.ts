import { Module } from '@nestjs/common';

import { BookingStepsController } from './booking-steps.controller';
import { BookingStepsService } from './booking-steps.service';

@Module({
    controllers: [BookingStepsController],
    providers: [BookingStepsService],
})
export class BookingStepsModule {}

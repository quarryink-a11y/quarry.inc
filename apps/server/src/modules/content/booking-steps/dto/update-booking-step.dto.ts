import { PartialType } from '@nestjs/swagger';

import { CreateBookingStepDto } from './create-booking-step.dto';

export class UpdateBookingStepDto extends PartialType(CreateBookingStepDto) {}

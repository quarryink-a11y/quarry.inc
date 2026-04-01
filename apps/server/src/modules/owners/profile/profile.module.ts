import { Module } from '@nestjs/common';
import { UtilityService } from 'src/shared/infrastructure/modules/utilities/utility.service';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    controllers: [ProfileController],
    providers: [ProfileService, UtilityService],
})
export class ProfileModule {}

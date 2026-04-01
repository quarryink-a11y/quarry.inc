import { Module } from '@nestjs/common';
import { UtilityService } from 'src/shared/infrastructure/modules/utilities/utility.service';

import { SiteSettingsController } from './site-settings.controller';
import { SiteSettingsService } from './site-settings.service';

@Module({
    controllers: [SiteSettingsController],
    providers: [SiteSettingsService, UtilityService],
})
export class SiteSettingsModule {}

import { Module } from '@nestjs/common';

import { SiteDomainController } from './site-domain.controller';
import { SiteDomainService } from './site-domain.service';

@Module({
    controllers: [SiteDomainController],
    providers: [SiteDomainService],
})
export class SiteDomainModule {}

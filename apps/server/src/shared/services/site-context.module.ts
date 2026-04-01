import { Global, Module } from '@nestjs/common';

import { SiteContextService } from './site-context.service';

@Global()
@Module({
    providers: [SiteContextService],
    exports: [SiteContextService],
})
export class SiteContextModule {}

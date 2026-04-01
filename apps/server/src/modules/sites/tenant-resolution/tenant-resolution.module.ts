import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { TenantResolutionService } from './tenant-resolution.service';

@Module({
    imports: [CacheModule.register({ ttl: 5 * 60 * 1000 })],
    providers: [TenantResolutionService],
    exports: [TenantResolutionService],
})
export class TenantResolutionModule {}

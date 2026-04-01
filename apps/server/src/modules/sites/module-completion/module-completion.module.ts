import { Module } from '@nestjs/common';

import { ModuleCompletionController } from './module-completion.controller';
import { ModuleCompletionService } from './module-completion.service';

@Module({
    controllers: [ModuleCompletionController],
    providers: [ModuleCompletionService],
})
export class ModuleCompletionModule {}

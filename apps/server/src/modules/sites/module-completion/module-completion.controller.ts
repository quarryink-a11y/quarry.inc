import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums';
import { CurrentUser, Roles } from 'src/modules/access/permissions/decorators';
import { JwtPayload } from 'src/shared/types';

import { CompleteModuleDto } from './dto/complete-module.dto';
import { CompleteModuleResponseDto } from './dto/complete-module-response.dto';
import { ModuleCompletionService } from './module-completion.service';

@ApiTags('Sites')
@ApiBearerAuth()
@Controller('sites')
@Roles(Role.OWNER, Role.ADMIN)
export class ModuleCompletionController {
    constructor(private readonly moduleCompletionService: ModuleCompletionService) {}

    @Post('complete-module')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Mark a module as completed for the current site' })
    @ApiBody({ type: CompleteModuleDto })
    @ApiOkResponse({
        description: 'Module marked as completed',
        type: CompleteModuleResponseDto,
    })
    completeModule(@CurrentUser() user: JwtPayload, @Body() dto: CompleteModuleDto) {
        return this.moduleCompletionService.completeModule(user.sub, dto.module);
    }
}

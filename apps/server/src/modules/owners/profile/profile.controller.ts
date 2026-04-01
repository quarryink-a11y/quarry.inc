import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/access/permissions/decorators';
import { JwtPayload } from 'src/shared/types';

import { ProfileMeResponseDto, UpdateProfileDto } from './dto';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get current owner profile with site context' })
    @ApiOkResponse({ type: ProfileMeResponseDto })
    getMe(@CurrentUser() user: JwtPayload) {
        return this.profileService.getMe(user.sub);
    }

    @Patch('me')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update current owner profile' })
    @ApiBody({ type: UpdateProfileDto })
    @ApiOkResponse({ description: 'Profile updated successfully' })
    updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
        return this.profileService.updateProfile(user.sub, dto);
    }
}

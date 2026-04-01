import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AuthUserDto } from './auth-user.dto';

export class AuthResponseDto {
    @ApiProperty({ type: AuthUserDto })
    user: AuthUserDto;

    @ApiPropertyOptional()
    accessToken?: string;

    @ApiPropertyOptional()
    refreshToken?: string;
}

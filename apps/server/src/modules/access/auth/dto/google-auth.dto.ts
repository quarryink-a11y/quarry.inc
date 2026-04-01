import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleAuthDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    idToken: string;

    @IsOptional()
    @IsIn(['auto', 'login_only'])
    @ApiPropertyOptional({ enum: ['auto', 'login_only'], default: 'auto' })
    mode?: 'auto' | 'login_only';
}

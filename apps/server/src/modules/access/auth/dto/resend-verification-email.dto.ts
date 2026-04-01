import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendVerificationEmailDto {
    @IsEmail()
    @ApiProperty()
    email: string;
}

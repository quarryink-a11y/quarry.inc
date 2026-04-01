import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class SignupDto {
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    @ApiProperty()
    password: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, nullable: true })
    displayName?: string;
}

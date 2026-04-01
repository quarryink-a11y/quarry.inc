import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
    @ApiProperty()
    success: true;

    @ApiProperty()
    email: string;
}

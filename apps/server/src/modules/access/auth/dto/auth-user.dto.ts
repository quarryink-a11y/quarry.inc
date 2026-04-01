import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ nullable: true })
    display_name: string | null;

    @ApiProperty({ nullable: true })
    avatar_url: string | null;

    @ApiProperty()
    email_verified: boolean;
}

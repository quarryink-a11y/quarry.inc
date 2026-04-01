import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    emailVerified: boolean;

    @ApiProperty({ nullable: true })
    displayName: string | null;

    @ApiProperty({ nullable: true })
    avatarUrl: string | null;

    @ApiProperty({ type: String, format: 'date-time' })
    createdAt: Date;

    @ApiProperty({ type: String, format: 'date-time' })
    updatedAt: Date;
}

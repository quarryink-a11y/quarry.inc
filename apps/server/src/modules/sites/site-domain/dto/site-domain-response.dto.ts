import { ApiProperty } from '@nestjs/swagger';

export class SiteDomainResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    host: string;

    @ApiProperty()
    kind: string;

    @ApiProperty()
    is_primary: boolean;

    @ApiProperty()
    is_verified: boolean;
}

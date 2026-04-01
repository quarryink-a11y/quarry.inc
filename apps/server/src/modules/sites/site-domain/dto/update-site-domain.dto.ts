import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { DomainKind } from 'generated/prisma/enums';

export class UpdateSiteDomainDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    host?: string;

    @ApiPropertyOptional({ enum: DomainKind })
    @IsOptional()
    @IsEnum(DomainKind)
    kind?: DomainKind;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_primary?: boolean;
}

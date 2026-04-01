import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { SiteSection } from 'generated/prisma/enums';

export class UpdateSiteDto {
    @ApiPropertyOptional({ enum: SiteSection, enumName: 'SiteSection', isArray: true })
    @IsOptional()
    @IsArray()
    @IsEnum(SiteSection, { each: true })
    completed_modules?: SiteSection[];
}

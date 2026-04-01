import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SiteSection } from 'generated/prisma/enums';

export class CompleteModuleDto {
    @ApiProperty({ enum: SiteSection, description: 'Module identifier to mark as completed' })
    @IsEnum(SiteSection)
    module: SiteSection;
}

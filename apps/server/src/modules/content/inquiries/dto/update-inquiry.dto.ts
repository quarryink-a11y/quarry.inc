import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { InquiryStatus } from 'generated/prisma/enums';

export class UpdateInquiryDto {
    @ApiPropertyOptional({ enum: InquiryStatus })
    @IsEnum(InquiryStatus)
    @IsOptional()
    status?: InquiryStatus;

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    final_price?: number;
}

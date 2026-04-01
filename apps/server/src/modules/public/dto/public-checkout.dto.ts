import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsNumber, IsOptional, IsString, IsUrl, Min, ValidateNested } from 'class-validator';

class CheckoutItemDto {
    @ApiProperty({ description: 'Catalog item ID' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Quantity to purchase', minimum: 1 })
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiPropertyOptional({ description: 'Custom price override (for gift certificates)' })
    @IsOptional()
    @IsNumber()
    @Min(0.01)
    price?: number;
}

export class PublicCheckoutDto {
    @ApiProperty({ type: [CheckoutItemDto] })
    @ValidateNested({ each: true })
    @Type(() => CheckoutItemDto)
    @ArrayMinSize(1)
    items: CheckoutItemDto[];

    @ApiProperty()
    @IsUrl({ require_tld: false })
    success_url: string;

    @ApiProperty()
    @IsUrl({ require_tld: false })
    cancel_url: string;
}

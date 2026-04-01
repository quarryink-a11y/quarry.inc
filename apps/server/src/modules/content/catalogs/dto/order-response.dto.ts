import { ApiProperty } from '@nestjs/swagger';
import { Currency, OrderStatus } from 'generated/prisma/enums';

export class OrderItemResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    catalog_id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    price: number;

    @ApiProperty({ enum: Currency })
    currency: Currency;

    @ApiProperty()
    quantity: number;
}

export class OrderResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    catalog_id: string;

    @ApiProperty()
    customer_name: string;

    @ApiProperty()
    customer_email: string;

    @ApiProperty()
    total_amount: number;

    @ApiProperty({ enum: Currency })
    currency: Currency;

    @ApiProperty({ enum: OrderStatus })
    status: OrderStatus;

    @ApiProperty({ type: [OrderItemResponseDto] })
    items: OrderItemResponseDto[];

    @ApiProperty()
    created_at: string;

    @ApiProperty()
    updated_at: string;
}

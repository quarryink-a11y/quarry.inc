import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ErrorCode } from './error-codes';

class ApiErrorDto {
    @ApiProperty({ enum: ErrorCode, enumName: 'ErrorCode' })
    code: ErrorCode;

    @ApiProperty()
    message: string;

    @ApiPropertyOptional()
    details?: unknown;
}

export class ApiErrorResponseDto {
    @ApiProperty({ example: false })
    success: false;

    @ApiProperty({ type: ApiErrorDto })
    error: ApiErrorDto;
}

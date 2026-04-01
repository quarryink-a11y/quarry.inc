import type { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

import type { ErrorCode } from './error-codes';

export type AppExceptionOptions = {
    status: HttpStatus;
    code: ErrorCode;
    message: string;
    details?: unknown;
};

export class AppException extends HttpException {
    constructor(options: AppExceptionOptions) {
        super(
            {
                code: options.code,
                message: options.message,
                details: options.details,
            },
            options.status
        );
    }
}

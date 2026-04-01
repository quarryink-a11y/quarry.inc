import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { ErrorCode } from './error-codes';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        if (typeof exceptionResponse === 'object' && exceptionResponse !== null && 'success' in exceptionResponse) {
            response.status(status).json(exceptionResponse);
            return;
        }

        if (status === Number(HttpStatus.BAD_REQUEST)) {
            response.status(status).json({
                success: false,
                error: {
                    code: ErrorCode.VALIDATION_ERROR,
                    message: 'Validation failed',
                    details: exceptionResponse,
                },
            });
            return;
        }

        response.status(status).json({
            success: false,
            error: {
                code:
                    status === Number(HttpStatus.UNAUTHORIZED)
                        ? ErrorCode.UNAUTHORIZED
                        : status === Number(HttpStatus.FORBIDDEN)
                          ? ErrorCode.FORBIDDEN
                          : ErrorCode.INTERNAL_ERROR,
                message:
                    typeof exceptionResponse === 'object' &&
                    exceptionResponse !== null &&
                    'message' in exceptionResponse
                        ? String((exceptionResponse as { message?: unknown }).message)
                        : 'Request failed',
            },
        });
    }
}

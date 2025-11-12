import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {ValidationError} from "class-validator";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
            }
            else if (typeof res === 'object' && (res as any).message) {
                message = Array.isArray((res as any).message)
                    ? (res as any).message.join(', ')
                    : (res as any).message;
            }
        } else if (Array.isArray(exception) && exception.every(e => e instanceof ValidationError)) {
            status = HttpStatus.BAD_REQUEST;

            const messages = exception.map((err: ValidationError) => {
                if (err.constraints) {
                    return Object.values(err.constraints);
                }
                return `Ошибка в поле ${err.property}`;
            });

            message = messages.flat().join(", ");
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        response.status(status).json({
            success: false,
            message,
        });
    }
}

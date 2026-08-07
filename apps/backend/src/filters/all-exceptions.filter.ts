import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import type { ExceptionResponse } from '~/filters/dto/exception-response.dto';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly defaultMessage = 'API server error';

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (response.headersSent) return;

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message, details } = this.extractErrorPayload(exception);

    const body: ExceptionResponse = {
      statusCode,
      path: request.originalUrl.split('?')[0] ?? request.url,
      message,
      details,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(body);
  }

  private extractErrorPayload(exception: unknown): {
    message: string;
    details?: string;
  } {
    if (!(exception instanceof HttpException)) {
      return { message: this.defaultMessage };
    }

    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return { message: exceptionResponse };
    }

    let message: string = this.defaultMessage;
    let details: string = '';

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      if ('message' in exceptionResponse)
        message = String(exceptionResponse.message);

      if ('details' in exceptionResponse)
        details = String(exceptionResponse.details);
    }

    return {
      message,
      details: details ? details : undefined,
    };
  }
}

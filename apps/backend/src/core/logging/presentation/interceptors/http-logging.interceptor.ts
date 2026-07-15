import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { type Observable, tap } from 'rxjs';

import { LoggerService } from '~/core/logging/application/logger.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const { method } = request;
    const route = this.resolveRoute(request);
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logRequest(method, route, context, startedAt);
        },
        error: () => {
          this.logRequest(method, route, context, startedAt);
        },
      }),
    );
  }

  private resolveRoute(request: Request): string {
    return request.originalUrl.split('?')[0] ?? request.url;
  }

  private logRequest(
    method: string,
    route: string,
    context: ExecutionContext,
    startedAt: number,
  ): void {
    const response = context.switchToHttp().getResponse<Response>();
    const duration = Date.now() - startedAt;

    this.logger.log(
      `${method} ${route} ${response.statusCode} ${duration}ms`,
      HttpLoggingInterceptor.name,
    );
  }
}

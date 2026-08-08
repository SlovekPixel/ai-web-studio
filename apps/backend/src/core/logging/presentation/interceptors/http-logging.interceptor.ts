import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';

import type { PublicUserType } from '@repo/types';

import { LoggerService } from '~/core/logging/application/logger.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const method = request.method;
    const path = this.resolvePath(request);
    const startedAt = Date.now();

    response.once('finish', () => {
      const username = this.resolveUsername(request);
      const durationMs = Date.now() - startedAt;

      this.logger.log(
        `${method} ${path} ${username} ${response.statusCode} ${durationMs}ms`,
        HttpLoggingInterceptor.name,
      );
    });

    return next.handle();
  }

  private resolvePath(request: Request): string {
    return request.originalUrl.split('?')[0] ?? request.url;
  }

  private resolveUsername(request: Request): string {
    const user = request.user as PublicUserType | undefined;
    return user?.login ?? 'unknown';
  }
}

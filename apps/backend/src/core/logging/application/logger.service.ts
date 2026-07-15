import { Inject, Injectable } from '@nestjs/common';
import type { Logger } from 'winston';

import type { ILoggerService } from '~/core/logging/domain/ports/logger.service.port';

export const WINSTON_LOGGER = Symbol('WINSTON_LOGGER');

@Injectable()
export class LoggerService implements ILoggerService {
  constructor(@Inject(WINSTON_LOGGER) private readonly winstonLogger: Logger) {}

  log(message: string, context?: string): void {
    this.winstonLogger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string): void {
    this.winstonLogger.error(message, { context, trace });
  }

  warn(message: string, context?: string): void {
    this.winstonLogger.warn(message, { context });
  }

  debug(message: string, context?: string): void {
    this.winstonLogger.debug(message, { context });
  }
}

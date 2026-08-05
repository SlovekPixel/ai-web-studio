import { Global, Module } from '@nestjs/common';

import {
  LoggerService,
  WINSTON_LOGGER,
} from '~/core/logging/application/logger.service';
import { LOGGER_SERVICE } from '~/core/logging/domain/ports/logger.service.port';
import { createWinstonLogger } from '~/core/logging/infrastructure/winston/create-winston-logger';

@Global()
@Module({
  providers: [
    {
      provide: WINSTON_LOGGER,
      useFactory: () => createWinstonLogger(),
    },
    LoggerService,
    {
      provide: LOGGER_SERVICE,
      useExisting: LoggerService,
    },
  ],
  exports: [LoggerService, LOGGER_SERVICE, WINSTON_LOGGER],
})
export class LoggingModule {}

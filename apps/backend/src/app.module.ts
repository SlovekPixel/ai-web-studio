import { Module } from '@nestjs/common';
import {
  APP_FILTER,
  APP_INTERCEPTOR,
  APP_PIPE,
  ContextIdFactory,
} from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { ConfigurationModule } from '~/core/configuration/configuration.module';
import { DatabaseModule } from '~/core/database/database.module';
import { AllExceptionsFilter } from '~/filters/all-exceptions.filter';
import { I18nModule } from '~/core/i18n/i18n.module';
import { AggregateByLocaleContextIdStrategy } from '~/core/i18n/infrastructure/aggregate-by-locale.strategy';
import { LoggingModule } from '~/core/logging/logging.module';
import { HttpLoggingInterceptor } from '~/core/logging/presentation/interceptors/http-logging.interceptor';
import { AuthModule } from '~/modules/auth/auth.module';
import { UsersModule } from '~/modules/users/users.module';

ContextIdFactory.apply(new AggregateByLocaleContextIdStrategy());

@Module({
  imports: [
    ConfigurationModule,
    LoggingModule,
    DatabaseModule,
    I18nModule,

    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
  ],
})
export class AppModule {}

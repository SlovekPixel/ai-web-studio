import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { ConfigurationModule } from '~/core/configuration/configuration.module';
import { DatabaseModule } from '~/core/database/database.module';
import { LoggingModule } from '~/core/logging/logging.module';
import { HttpLoggingInterceptor } from '~/core/logging/presentation/interceptors/http-logging.interceptor';
import { AuthModule } from '~/modules/auth/auth.module';
import { UserModule } from '~/modules/user/user.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    LoggingModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
  ],
})
export class AppModule {}

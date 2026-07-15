import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { ConfigurationModule } from '~/core/configuration/configuration.module';
import { AuthModule } from '~/modules/auth/auth.module';

@Module({
  imports: [ConfigurationModule, AuthModule],
  providers: [{
    provide: APP_PIPE,
    useClass: ZodValidationPipe,
  }],
})
export class AppModule {}

import { Module } from '@nestjs/common';

import { AuthService } from '~/modules/auth/application/auth.service';
import { AUTH_SERVICE } from '~/modules/auth/domain/ports/auth.service.port';
import { AuthController } from '~/modules/auth/presentation/http/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AUTH_SERVICE,
      useExisting: AuthService,
    },
  ],
  exports: [AuthService, AUTH_SERVICE],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from '~/modules/auth/application/auth.service';
import { AUTH_SERVICE } from '~/modules/auth/domain/ports/auth.service.port';
import { PASSWORD_HASHER } from '~/modules/auth/domain/ports/password-hasher.port';
import { TOKEN_SERVICE } from '~/modules/auth/domain/ports/token.service.port';
import { BcryptPasswordHasher } from '~/modules/auth/infrastructure/bcrypt/bcrypt-password-hasher';
import { JwtTokenService } from '~/modules/auth/infrastructure/jwt/jwt-token.service';
import { AuthController } from '~/modules/auth/presentation/http/auth.controller';
import { UserModule } from '~/modules/user/user.module';

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    BcryptPasswordHasher,
    JwtTokenService,
    {
      provide: AUTH_SERVICE,
      useExisting: AuthService,
    },
    {
      provide: PASSWORD_HASHER,
      useExisting: BcryptPasswordHasher,
    },
    {
      provide: TOKEN_SERVICE,
      useExisting: JwtTokenService,
    },
  ],
  exports: [AuthService, AUTH_SERVICE],
})
export class AuthModule {}

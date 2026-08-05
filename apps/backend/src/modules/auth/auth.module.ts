import { Module } from '@nestjs/common';

import { AuthService } from '~/modules/auth/application/auth.service';
import { PASSWORD_HASHER } from '~/modules/auth/domain/ports/password-hasher.port';
import { BcryptPasswordHasher } from '~/modules/auth/infrastructure/bcrypt/bcrypt-password-hasher';
import { AuthController } from '~/modules/auth/presentation/http/auth.controller';
import { UsersModule } from '~/modules/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
  ],
})
export class AuthModule {}

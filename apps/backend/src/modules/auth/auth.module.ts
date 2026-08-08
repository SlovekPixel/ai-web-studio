import { Module } from '@nestjs/common';

import { LoginUseCase } from '~/modules/auth/application/use-cases/login.use-case';
import { RegisterUseCase } from '~/modules/auth/application/use-cases/register.use-case';
import { PASSWORD_HASHER } from '~/modules/auth/domain/ports/password-hasher.port';
import { BcryptPasswordHasher } from '~/modules/auth/infrastructure/bcrypt/bcrypt-password-hasher';
import { AuthController } from '~/modules/auth/presentation/http/auth.controller';
import { UsersModule } from '~/modules/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
  ],
})
export class AuthModule {}

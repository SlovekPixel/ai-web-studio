import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { IssueAuthSessionService } from '~/modules/auth/application/services/issue-auth-session.service';
import { LoginUseCase } from '~/modules/auth/application/use-cases/login.use-case';
import { LogoutAllUseCase } from '~/modules/auth/application/use-cases/logout-all.use-case';
import { LogoutUseCase } from '~/modules/auth/application/use-cases/logout.use-case';
import { RefreshUseCase } from '~/modules/auth/application/use-cases/refresh.use-case';
import { RegisterUseCase } from '~/modules/auth/application/use-cases/register.use-case';
import { AUTH_SESSION_STORE } from '~/modules/auth/domain/ports/auth-session-store.port';
import { PASSWORD_HASHER } from '~/modules/auth/domain/ports/password-hasher.port';
import { TOKEN_SERVICE } from '~/modules/auth/domain/ports/token-service.port';
import { BcryptPasswordHasher } from '~/modules/auth/infrastructure/bcrypt/bcrypt-password-hasher';
import { NestJsJwtTokenService } from '~/modules/auth/infrastructure/jwt/nestjs-jwt-token.service';
import { JwtStrategy } from '~/modules/auth/infrastructure/passport/jwt.strategy';
import { RedisAuthSessionStore } from '~/modules/auth/infrastructure/redis/redis-auth-session.store';
import { AuthController } from '~/modules/auth/presentation/http/auth.controller';
import { UsersModule } from '~/modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    RefreshUseCase,
    LogoutUseCase,
    LogoutAllUseCase,
    IssueAuthSessionService,
    JwtStrategy,
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: NestJsJwtTokenService,
    },
    {
      provide: AUTH_SESSION_STORE,
      useClass: RedisAuthSessionStore,
    },
  ],
  exports: [PassportModule, JwtModule, TOKEN_SERVICE, AUTH_SESSION_STORE],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { IssueAuthSessionService } from '~/modules/auth/application/services/issue-auth-session.service';
import { SeedSystemAdminService } from '~/modules/auth/application/services/seed-system-admin.service';
import { LoginUseCase } from '~/modules/auth/application/use-cases/login.use-case';
import { LogoutAllUseCase } from '~/modules/auth/application/use-cases/logout-all.use-case';
import { LogoutUseCase } from '~/modules/auth/application/use-cases/logout.use-case';
import { RefreshUseCase } from '~/modules/auth/application/use-cases/refresh.use-case';
import { RegisterOrgAdminUseCase } from '~/modules/auth/application/use-cases/register-org-admin.use-case';
import { RegisterOrgUserUseCase } from '~/modules/auth/application/use-cases/register-org-user.use-case';
import { AUTH_SESSION_STORE } from '~/modules/auth/domain/ports/auth-session-store.port';
import { PASSWORD_HASHER } from '~/modules/auth/domain/ports/password-hasher.port';
import { TOKEN_SERVICE } from '~/modules/auth/domain/ports/token-service.port';
import { BcryptPasswordHasher } from '~/modules/auth/infrastructure/bcrypt/bcrypt-password-hasher';
import { NestJsJwtTokenService } from '~/modules/auth/infrastructure/jwt/nestjs-jwt-token.service';
import { JwtStrategy } from '~/modules/auth/infrastructure/passport/jwt.strategy';
import { RedisAuthSessionStore } from '~/modules/auth/infrastructure/redis/redis-auth-session.store';
import { AuthController } from '~/modules/auth/presentation/http/auth.controller';
import { AuthorizationGuard } from '~/modules/auth/presentation/http/guards/authorization.guard';
import { JwtAuthGuard } from '~/modules/auth/presentation/http/guards/jwt-auth.guard';
import { OrganizationsModule } from '~/modules/organizations/organizations.module';
import { UsersModule } from '~/modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    OrganizationsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    RegisterOrgAdminUseCase,
    RegisterOrgUserUseCase,
    LoginUseCase,
    RefreshUseCase,
    LogoutUseCase,
    LogoutAllUseCase,
    IssueAuthSessionService,
    SeedSystemAdminService,
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
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
  exports: [PassportModule, JwtModule, TOKEN_SERVICE, AUTH_SESSION_STORE],
})
export class AuthModule {}

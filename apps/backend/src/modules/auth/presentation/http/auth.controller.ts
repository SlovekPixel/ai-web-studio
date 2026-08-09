import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { PublicUserType } from '@repo/types';
import type { Request, Response } from 'express';

import {
  CONFIGURATION_SERVICE,
  type IConfigurationService,
} from '~/core/configuration/domain/ports/configuration.service.port';
import { ChangePasswordUseCase } from '~/modules/auth/application/use-cases/change-password.use-case';
import { LoginUseCase } from '~/modules/auth/application/use-cases/login.use-case';
import { LogoutAllUseCase } from '~/modules/auth/application/use-cases/logout-all.use-case';
import { LogoutUseCase } from '~/modules/auth/application/use-cases/logout.use-case';
import { RefreshUseCase } from '~/modules/auth/application/use-cases/refresh.use-case';
import { RegisterOrgAdminUseCase } from '~/modules/auth/application/use-cases/register-org-admin.use-case';
import { RegisterOrgUserUseCase } from '~/modules/auth/application/use-cases/register-org-user.use-case';
import type { IssuedTokenPair } from '~/modules/auth/domain/ports/token-service.port';
import {
  ACCESS_TOKEN_COOKIE,
  AuthCookies,
  REFRESH_TOKEN_COOKIE,
} from '~/modules/auth/presentation/http/cookies/auth-cookies';
import { ChangePasswordRequestDto } from '~/modules/auth/presentation/http/dto/change-password-request.dto';
import { LoginRequestDto } from '~/modules/auth/presentation/http/dto/login-request.dto';
import { RegisterOrgAdminRequestDto } from '~/modules/auth/presentation/http/dto/register-org-admin-request.dto';
import { RegisterOrgUserRequestDto } from '~/modules/auth/presentation/http/dto/register-org-user-request.dto';
import { CurrentUser } from '~/modules/auth/presentation/http/decorators/current-user.decorator';
import { IsPublic } from '~/modules/auth/presentation/http/decorators/is-public.decorator';
import { IsUser } from '~/modules/auth/presentation/http/decorators/is-user.decorator';
import { ChangePasswordSwagger } from '~/modules/auth/presentation/http/swagger/change-password.swagger';
import { LoginSwagger } from '~/modules/auth/presentation/http/swagger/login.swagger';
import { LogoutAllSwagger } from '~/modules/auth/presentation/http/swagger/logout-all.swagger';
import { LogoutSwagger } from '~/modules/auth/presentation/http/swagger/logout.swagger';
import { RefreshSwagger } from '~/modules/auth/presentation/http/swagger/refresh.swagger';
import { RegisterOrgAdminSwagger } from '~/modules/auth/presentation/http/swagger/register-org-admin.swagger';
import { RegisterOrgUserSwagger } from '~/modules/auth/presentation/http/swagger/register-org-user.swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly authCookies: AuthCookies;

  constructor(
    private readonly registerOrgAdminUseCase: RegisterOrgAdminUseCase,
    private readonly registerOrgUserUseCase: RegisterOrgUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly logoutAllUseCase: LogoutAllUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    @Inject(CONFIGURATION_SERVICE)
    config: IConfigurationService,
  ) {
    this.authCookies = new AuthCookies(config);
  }

  @Post('register/org-admin')
  @IsPublic()
  @HttpCode(HttpStatus.CREATED)
  @RegisterOrgAdminSwagger()
  async registerOrgAdmin(
    @Body() body: RegisterOrgAdminRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await this.registerOrgAdminUseCase.execute(body);
    this.setCookies(response, tokens);
  }

  @Post('register/org-user')
  @IsPublic()
  @HttpCode(HttpStatus.CREATED)
  @RegisterOrgUserSwagger()
  async registerOrgUser(
    @Body() body: RegisterOrgUserRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await this.registerOrgUserUseCase.execute(body);
    this.setCookies(response, tokens);
  }

  @Post('login')
  @IsPublic()
  @HttpCode(HttpStatus.NO_CONTENT)
  @LoginSwagger()
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await this.loginUseCase.execute(body.login, body.password);
    this.setCookies(response, tokens);
  }

  @Post('refresh')
  @IsPublic()
  @HttpCode(HttpStatus.NO_CONTENT)
  @RefreshSwagger()
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await this.refreshUseCase.execute(
      this.readCookie(request, REFRESH_TOKEN_COOKIE),
    );
    this.setCookies(response, tokens);
  }

  @Post('logout')
  @IsPublic()
  @HttpCode(HttpStatus.NO_CONTENT)
  @LogoutSwagger()
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.logoutUseCase.execute(
      this.readCookie(request, ACCESS_TOKEN_COOKIE),
      this.readCookie(request, REFRESH_TOKEN_COOKIE),
    );
    this.authCookies.clearAuthCookies(response);
  }

  @Post('logout-all')
  @IsPublic()
  @HttpCode(HttpStatus.NO_CONTENT)
  @LogoutAllSwagger()
  async logoutAll(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.logoutAllUseCase.execute(
      this.readCookie(request, ACCESS_TOKEN_COOKIE),
      this.readCookie(request, REFRESH_TOKEN_COOKIE),
    );
    this.authCookies.clearAuthCookies(response);
  }

  @Post('change-password')
  @IsUser()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ChangePasswordSwagger()
  changePassword(
    @CurrentUser() user: PublicUserType,
    @Body() body: ChangePasswordRequestDto,
  ): Promise<void> {
    return this.changePasswordUseCase.execute(user.id, body);
  }

  private setCookies(response: Response, tokens: IssuedTokenPair): void {
    this.authCookies.setAuthCookies(response, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessMaxAgeSeconds: tokens.accessExpiresInSeconds,
      refreshMaxAgeSeconds: tokens.refreshExpiresInSeconds,
    });
  }

  private readCookie(request: Request, name: string): string | undefined {
    const cookies = request.cookies as Record<string, unknown> | undefined;
    const value = cookies?.[name];
    return typeof value === 'string' ? value : undefined;
  }
}

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
import type { Request, Response } from 'express';

import {
  CONFIGURATION_SERVICE,
  type IConfigurationService,
} from '~/core/configuration/domain/ports/configuration.service.port';
import { LoginUseCase } from '~/modules/auth/application/use-cases/login.use-case';
import { LogoutAllUseCase } from '~/modules/auth/application/use-cases/logout-all.use-case';
import { LogoutUseCase } from '~/modules/auth/application/use-cases/logout.use-case';
import { RefreshUseCase } from '~/modules/auth/application/use-cases/refresh.use-case';
import { RegisterUseCase } from '~/modules/auth/application/use-cases/register.use-case';
import type { IssuedTokenPair } from '~/modules/auth/domain/ports/token-service.port';
import {
  ACCESS_TOKEN_COOKIE,
  AuthCookies,
  REFRESH_TOKEN_COOKIE,
} from '~/modules/auth/presentation/http/cookies/auth-cookies';
import { LoginRequestDto } from '~/modules/auth/presentation/http/dto/login-request.dto';
import { RegisterRequestDto } from '~/modules/auth/presentation/http/dto/register-request.dto';
import { LoginSwagger } from '~/modules/auth/presentation/http/swagger/login.swagger';
import { LogoutAllSwagger } from '~/modules/auth/presentation/http/swagger/logout-all.swagger';
import { LogoutSwagger } from '~/modules/auth/presentation/http/swagger/logout.swagger';
import { RefreshSwagger } from '~/modules/auth/presentation/http/swagger/refresh.swagger';
import { RegisterSwagger } from '~/modules/auth/presentation/http/swagger/register.swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly authCookies: AuthCookies;

  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly logoutAllUseCase: LogoutAllUseCase,
    @Inject(CONFIGURATION_SERVICE)
    config: IConfigurationService,
  ) {
    this.authCookies = new AuthCookies(config);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @RegisterSwagger()
  async register(
    @Body() body: RegisterRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await this.registerUseCase.execute(
      body.login,
      body.password,
      body.fullName,
    );
    this.setCookies(response, tokens);
  }

  @Post('login')
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

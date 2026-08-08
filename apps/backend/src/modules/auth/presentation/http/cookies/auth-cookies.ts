import type { CookieOptions, Response } from 'express';

import type { IConfigurationService } from '~/core/configuration/domain/ports/configuration.service.port';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '~/modules/auth/domain/constants/auth-cookies';

export { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE };

const REFRESH_COOKIE_PATH = '/api/auth';

export type AuthCookieTokens = {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly accessMaxAgeSeconds: number;
  readonly refreshMaxAgeSeconds: number;
};

export class AuthCookies {
  constructor(private readonly config: IConfigurationService) {}

  setAuthCookies(response: Response, tokens: AuthCookieTokens): void {
    response.cookie(
      ACCESS_TOKEN_COOKIE,
      tokens.accessToken,
      this.buildCookieOptions('/', tokens.accessMaxAgeSeconds),
    );
    response.cookie(
      REFRESH_TOKEN_COOKIE,
      tokens.refreshToken,
      this.buildCookieOptions(REFRESH_COOKIE_PATH, tokens.refreshMaxAgeSeconds),
    );
  }

  clearAuthCookies(response: Response): void {
    response.clearCookie(
      ACCESS_TOKEN_COOKIE,
      this.buildCookieOptions('/', undefined),
    );
    response.clearCookie(
      REFRESH_TOKEN_COOKIE,
      this.buildCookieOptions(REFRESH_COOKIE_PATH, undefined),
    );
  }

  private buildCookieOptions(
    path: string,
    maxAgeSeconds?: number,
  ): CookieOptions {
    const options: CookieOptions = {
      httpOnly: true,
      secure: this.config.isProduction,
      sameSite: 'lax',
      path,
    };

    if (maxAgeSeconds !== undefined) {
      options.maxAge = maxAgeSeconds * 1000;
    }

    return options;
  }
}

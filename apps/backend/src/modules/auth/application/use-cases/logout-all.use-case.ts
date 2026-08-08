import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  AUTH_SESSION_STORE,
  type IAuthSessionStore,
} from '~/modules/auth/domain/ports/auth-session-store.port';
import {
  TOKEN_SERVICE,
  type ITokenService,
} from '~/modules/auth/domain/ports/token-service.port';

@Injectable()
export class LogoutAllUseCase {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
    @Inject(AUTH_SESSION_STORE)
    private readonly sessionStore: IAuthSessionStore,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(
    accessToken: string | undefined,
    refreshToken: string | undefined,
  ): Promise<void> {
    const userId = await this.resolveUserId(accessToken, refreshToken);

    if (!userId) {
      throw new UnauthorizedException(
        this.i18nService.translate('ERRORS.UNAUTHORIZED'),
      );
    }

    if (accessToken) {
      try {
        const accessPayload =
          await this.tokenService.verifyAccessToken(accessToken);
        const ttl = this.tokenService.getAccessRemainingTtlSeconds(accessToken);
        await this.sessionStore.blacklistAccessToken(accessPayload.jti, ttl);
      } catch {
        // Best-effort blacklist for the current access token.
      }
    }

    await this.sessionStore.deleteAllUserSessions(userId);
    await this.sessionStore.setRevokeBefore(userId, Date.now());
  }

  private async resolveUserId(
    accessToken: string | undefined,
    refreshToken: string | undefined,
  ): Promise<string | null> {
    if (refreshToken) {
      try {
        const refreshPayload =
          await this.tokenService.verifyRefreshToken(refreshToken);
        return refreshPayload.sub;
      } catch {
        // Fall back to access token.
      }
    }

    if (accessToken) {
      try {
        const accessPayload =
          await this.tokenService.verifyAccessToken(accessToken);
        return accessPayload.sub;
      } catch {
        return null;
      }
    }

    return null;
  }
}

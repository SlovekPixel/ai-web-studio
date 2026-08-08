import { Inject, Injectable } from '@nestjs/common';

import {
  AUTH_SESSION_STORE,
  type IAuthSessionStore,
} from '~/modules/auth/domain/ports/auth-session-store.port';
import {
  TOKEN_SERVICE,
  type ITokenService,
} from '~/modules/auth/domain/ports/token-service.port';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
    @Inject(AUTH_SESSION_STORE)
    private readonly sessionStore: IAuthSessionStore,
  ) {}

  async execute(
    accessToken: string | undefined,
    refreshToken: string | undefined,
  ): Promise<void> {
    if (accessToken) {
      try {
        const accessPayload =
          await this.tokenService.verifyAccessToken(accessToken);
        const ttl = this.tokenService.getAccessRemainingTtlSeconds(accessToken);
        await this.sessionStore.blacklistAccessToken(accessPayload.jti, ttl);
      } catch {
        // Idempotent logout: ignore invalid/expired access token.
      }
    }

    if (refreshToken) {
      try {
        const refreshPayload =
          await this.tokenService.verifyRefreshToken(refreshToken);
        await this.sessionStore.deleteRefreshSession(
          refreshPayload.sid,
          refreshPayload.sub,
        );
      } catch {
        // Idempotent logout: ignore invalid/expired refresh token.
      }
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';

import type { PublicUserType } from '@repo/types';

import { hashToken } from '~/modules/auth/application/utils/hash-token';
import {
  AUTH_SESSION_STORE,
  type IAuthSessionStore,
} from '~/modules/auth/domain/ports/auth-session-store.port';
import {
  TOKEN_SERVICE,
  type IssuedTokenPair,
  type ITokenService,
} from '~/modules/auth/domain/ports/token-service.port';

@Injectable()
export class IssueAuthSessionService {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
    @Inject(AUTH_SESSION_STORE)
    private readonly sessionStore: IAuthSessionStore,
  ) {}

  async execute(user: PublicUserType): Promise<IssuedTokenPair> {
    const tokens = await this.tokenService.issueTokenPair(user);

    await this.sessionStore.saveRefreshSession(
      tokens.refreshPayload.sid,
      {
        userId: user.id,
        tokenHash: hashToken(tokens.refreshToken),
      },
      tokens.refreshExpiresInSeconds,
    );

    return tokens;
  }
}

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
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
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '~/modules/users/domain/ports/user.repository.port';

@Injectable()
export class RefreshUseCase {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
    @Inject(AUTH_SESSION_STORE)
    private readonly sessionStore: IAuthSessionStore,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(refreshToken: string | undefined): Promise<IssuedTokenPair> {
    if (!refreshToken) {
      throw new UnauthorizedException(
        this.i18nService.translate('ERRORS.INVALID_REFRESH_TOKEN'),
      );
    }

    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    const session = await this.sessionStore.getRefreshSession(payload.sid);

    if (!session || session.userId !== payload.sub) {
      throw new UnauthorizedException(
        this.i18nService.translate('ERRORS.INVALID_REFRESH_TOKEN'),
      );
    }

    if (session.tokenHash !== hashToken(refreshToken)) {
      await this.sessionStore.deleteAllUserSessions(payload.sub);
      await this.sessionStore.setRevokeBefore(payload.sub, Date.now());
      throw new UnauthorizedException(
        this.i18nService.translate('ERRORS.INVALID_REFRESH_TOKEN'),
      );
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user || !user.active) {
      await this.sessionStore.deleteRefreshSession(payload.sid, payload.sub);
      throw new UnauthorizedException(
        this.i18nService.translate('ERRORS.INVALID_REFRESH_TOKEN'),
      );
    }

    await this.sessionStore.deleteRefreshSession(payload.sid, payload.sub);

    const tokens = await this.tokenService.issueTokenPair(user.toPublic());

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

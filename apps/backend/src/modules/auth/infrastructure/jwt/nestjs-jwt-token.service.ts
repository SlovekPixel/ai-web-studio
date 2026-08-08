import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';

import type {
  AccessTokenPayloadType,
  PublicUserType,
  RefreshTokenPayloadType,
} from '@repo/types';
import {
  AccessTokenPayloadSchema,
  RefreshTokenPayloadSchema,
} from '@repo/types';

import {
  CONFIGURATION_SERVICE,
  type IConfigurationService,
} from '~/core/configuration/domain/ports/configuration.service.port';
import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import type {
  IssuedTokenPair,
  ITokenService,
} from '~/modules/auth/domain/ports/token-service.port';

@Injectable()
export class NestJsJwtTokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CONFIGURATION_SERVICE)
    private readonly config: IConfigurationService,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async issueTokenPair(
    user: PublicUserType,
    sessionId: string = randomUUID(),
  ): Promise<IssuedTokenPair> {
    const accessExpiresInSeconds = this.config.jwt.accessTtlSeconds;
    const refreshExpiresInSeconds = this.config.jwt.refreshTtlSeconds;

    const accessPayload: AccessTokenPayloadType = {
      sub: user.id,
      jti: randomUUID(),
      sid: sessionId,
      typ: 'access',
      user,
    };

    const refreshPayload: RefreshTokenPayloadType = {
      sub: user.id,
      jti: randomUUID(),
      sid: sessionId,
      typ: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.config.jwt.accessSecret,
        expiresIn: accessExpiresInSeconds,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.config.jwt.refreshSecret,
        expiresIn: refreshExpiresInSeconds,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      accessPayload,
      refreshPayload,
      accessExpiresInSeconds,
      refreshExpiresInSeconds,
    };
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayloadType> {
    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenPayloadType>(
        token,
        { secret: this.config.jwt.accessSecret },
      );

      return AccessTokenPayloadSchema.parse(payload);
    } catch {
      throw new UnauthorizedException(
        this.i18nService.translate('ERRORS.INVALID_TOKEN'),
      );
    }
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayloadType> {
    try {
      const payload =
        await this.jwtService.verifyAsync<RefreshTokenPayloadType>(token, {
          secret: this.config.jwt.refreshSecret,
        });

      return RefreshTokenPayloadSchema.parse(payload);
    } catch {
      throw new UnauthorizedException(
        this.i18nService.translate('ERRORS.INVALID_REFRESH_TOKEN'),
      );
    }
  }

  getAccessRemainingTtlSeconds(token: string): number {
    const decoded = this.jwtService.decode<{ exp?: number }>(token);

    if (!decoded?.exp) {
      return this.config.jwt.accessTtlSeconds;
    }

    const remaining = decoded.exp - Math.floor(Date.now() / 1000);
    return Math.max(remaining, 1);
  }
}

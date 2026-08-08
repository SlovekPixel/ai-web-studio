import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { AccessTokenPayloadType, PublicUserType } from '@repo/types';
import { AccessTokenPayloadSchema } from '@repo/types';

import {
  CONFIGURATION_SERVICE,
  type IConfigurationService,
} from '~/core/configuration/domain/ports/configuration.service.port';
import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  AUTH_SESSION_STORE,
  type IAuthSessionStore,
} from '~/modules/auth/domain/ports/auth-session-store.port';
import { ACCESS_TOKEN_COOKIE } from '~/modules/auth/domain/constants/auth-cookies';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(CONFIGURATION_SERVICE)
    config: IConfigurationService,
    @Inject(AUTH_SESSION_STORE)
    private readonly sessionStore: IAuthSessionStore,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          const cookies = request.cookies as
            | Record<string, unknown>
            | undefined;
          const token = cookies?.[ACCESS_TOKEN_COOKIE];
          return typeof token === 'string' ? token : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.jwt.accessSecret,
    });
  }

  async validate(payload: AccessTokenPayloadType): Promise<PublicUserType> {
    const parsed = AccessTokenPayloadSchema.safeParse(payload);

    if (!parsed.success || parsed.data.typ !== 'access') {
      throw new UnauthorizedException(
        this.i18nService.translate('ERRORS.INVALID_TOKEN'),
      );
    }

    const isBlacklisted = await this.sessionStore.isAccessTokenBlacklisted(
      parsed.data.jti,
    );

    if (isBlacklisted) {
      throw new UnauthorizedException(
        this.i18nService.translate('ERRORS.INVALID_TOKEN'),
      );
    }

    const revokeBefore = await this.sessionStore.getRevokeBefore(
      parsed.data.sub,
    );

    if (revokeBefore !== null) {
      const issuedAtMs = this.getIssuedAtMs(payload);

      if (issuedAtMs !== null && issuedAtMs <= revokeBefore) {
        throw new UnauthorizedException(
          this.i18nService.translate('ERRORS.INVALID_TOKEN'),
        );
      }
    }

    return parsed.data.user;
  }

  private getIssuedAtMs(payload: AccessTokenPayloadType): number | null {
    const iat = (payload as AccessTokenPayloadType & { iat?: number }).iat;

    if (typeof iat !== 'number') {
      return null;
    }

    return iat * 1000;
  }
}

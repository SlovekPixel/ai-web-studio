import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigurationService } from '~/core/configuration/application/configuration.service';
import type {
  AuthTokens,
  ITokenService,
  TokenUserPayload,
} from '~/modules/auth/domain/ports/token.service.port';

type JwtTokenType = 'access' | 'refresh';

type JwtPayload = TokenUserPayload & {
  sub: string;
  type: JwtTokenType;
};

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configuration: ConfigurationService,
  ) {}

  async issueTokens(user: TokenUserPayload): Promise<AuthTokens> {
    const payload = this.toPayload(user);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload, type: 'access' satisfies JwtTokenType },
        {
          secret: this.configuration.jwtAccessSecret,
          expiresIn: this.configuration.jwtAccessExpiresIn as `${number}m`,
        },
      ),
      this.jwtService.signAsync(
        { ...payload, type: 'refresh' satisfies JwtTokenType },
        {
          secret: this.configuration.jwtRefreshSecret,
          expiresIn: this.configuration.jwtRefreshExpiresIn as `${number}d`,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(refreshToken: string): Promise<TokenUserPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configuration.jwtRefreshSecret,
        },
      );

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return {
        id: payload.sub,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private toPayload(user: TokenUserPayload): Omit<JwtPayload, 'type'> {
    return {
      sub: user.id,
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}

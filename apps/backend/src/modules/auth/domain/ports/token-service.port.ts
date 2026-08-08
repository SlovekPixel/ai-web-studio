import type {
  AccessTokenPayloadType,
  PublicUserType,
  RefreshTokenPayloadType,
} from '@repo/types';

export type IssuedTokenPair = {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly accessPayload: AccessTokenPayloadType;
  readonly refreshPayload: RefreshTokenPayloadType;
  readonly accessExpiresInSeconds: number;
  readonly refreshExpiresInSeconds: number;
};

export interface ITokenService {
  issueTokenPair(
    user: PublicUserType,
    sessionId?: string,
  ): Promise<IssuedTokenPair>;
  verifyAccessToken(token: string): Promise<AccessTokenPayloadType>;
  verifyRefreshToken(token: string): Promise<RefreshTokenPayloadType>;
  getAccessRemainingTtlSeconds(token: string): number;
}

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');

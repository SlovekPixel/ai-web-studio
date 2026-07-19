import type { PublicUser } from '~/modules/user/domain/entities/user.entity';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type TokenUserPayload = Pick<
  PublicUser,
  'id' | 'email' | 'firstName' | 'lastName'
>;

export interface ITokenService {
  issueTokens(user: TokenUserPayload): Promise<AuthTokens>;
  verifyRefreshToken(refreshToken: string): Promise<TokenUserPayload>;
}

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');

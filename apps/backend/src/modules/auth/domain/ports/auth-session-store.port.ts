export type AuthRefreshSession = {
  readonly userId: string;
  readonly tokenHash: string;
};

export interface IAuthSessionStore {
  saveRefreshSession(
    sessionId: string,
    session: AuthRefreshSession,
    ttlSeconds: number,
  ): Promise<void>;
  getRefreshSession(sessionId: string): Promise<AuthRefreshSession | null>;
  deleteRefreshSession(sessionId: string, userId: string): Promise<void>;
  deleteAllUserSessions(userId: string): Promise<void>;
  blacklistAccessToken(jti: string, ttlSeconds: number): Promise<void>;
  isAccessTokenBlacklisted(jti: string): Promise<boolean>;
  setRevokeBefore(userId: string, revokeBeforeMs: number): Promise<void>;
  getRevokeBefore(userId: string): Promise<number | null>;
}

export const AUTH_SESSION_STORE = Symbol('AUTH_SESSION_STORE');

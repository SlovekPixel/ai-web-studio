import { Inject, Injectable } from '@nestjs/common';

import {
  REDIS_CLIENT,
  type IRedisClient,
} from '~/core/redis/domain/ports/redis.client.port';
import type {
  AuthRefreshSession,
  IAuthSessionStore,
} from '~/modules/auth/domain/ports/auth-session-store.port';

const refreshSessionKey = (sessionId: string): string =>
  `auth:refresh:${sessionId}`;
const userSessionsKey = (userId: string): string =>
  `auth:user_sessions:${userId}`;
const accessBlacklistKey = (jti: string): string =>
  `auth:access:blacklist:${jti}`;
const revokeBeforeKey = (userId: string): string =>
  `auth:user:${userId}:revoke_before`;

@Injectable()
export class RedisAuthSessionStore implements IAuthSessionStore {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: IRedisClient,
  ) {}

  async saveRefreshSession(
    sessionId: string,
    session: AuthRefreshSession,
    ttlSeconds: number,
  ): Promise<void> {
    await this.redis.set(
      refreshSessionKey(sessionId),
      JSON.stringify(session),
      ttlSeconds,
    );
    await this.redis.sadd(userSessionsKey(session.userId), sessionId);
  }

  async getRefreshSession(
    sessionId: string,
  ): Promise<AuthRefreshSession | null> {
    const raw = await this.redis.get(refreshSessionKey(sessionId));

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as AuthRefreshSession;
    return parsed;
  }

  async deleteRefreshSession(sessionId: string, userId: string): Promise<void> {
    await this.redis.del(refreshSessionKey(sessionId));
    await this.redis.srem(userSessionsKey(userId), sessionId);
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    const sessionIds = await this.redis.smembers(userSessionsKey(userId));

    if (sessionIds.length > 0) {
      await this.redis.del(
        ...sessionIds.map((sessionId) => refreshSessionKey(sessionId)),
      );
    }

    await this.redis.del(userSessionsKey(userId));
  }

  async blacklistAccessToken(jti: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(accessBlacklistKey(jti), '1', ttlSeconds);
  }

  async isAccessTokenBlacklisted(jti: string): Promise<boolean> {
    const value = await this.redis.get(accessBlacklistKey(jti));
    return value !== null;
  }

  async setRevokeBefore(userId: string, revokeBeforeMs: number): Promise<void> {
    await this.redis.set(revokeBeforeKey(userId), String(revokeBeforeMs));
  }

  async getRevokeBefore(userId: string): Promise<number | null> {
    const value = await this.redis.get(revokeBeforeKey(userId));

    if (!value) {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}

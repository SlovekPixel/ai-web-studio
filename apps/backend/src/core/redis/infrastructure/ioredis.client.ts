import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';

import {
  CONFIGURATION_SERVICE,
  type IConfigurationService,
} from '~/core/configuration/domain/ports/configuration.service.port';
import type { IRedisClient } from '~/core/redis/domain/ports/redis.client.port';

@Injectable()
export class IoRedisClient
  implements IRedisClient, OnModuleInit, OnModuleDestroy
{
  private readonly client: Redis;

  constructor(
    @Inject(CONFIGURATION_SERVICE)
    private readonly config: IConfigurationService,
  ) {
    const { host, port, password, db } = this.config.redis;

    this.client = new Redis({
      host,
      port,
      password,
      db,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  getdel(key: string): Promise<string | null> {
    return this.client.getdel(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds !== undefined) {
      await this.client.set(key, value, 'EX', ttlSeconds);
      return;
    }

    await this.client.set(key, value);
  }

  del(...keys: string[]): Promise<number> {
    if (keys.length === 0) {
      return Promise.resolve(0);
    }

    return this.client.del(...keys);
  }

  ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  sadd(key: string, ...members: string[]): Promise<number> {
    return this.client.sadd(key, ...members);
  }

  srem(key: string, ...members: string[]): Promise<number> {
    return this.client.srem(key, ...members);
  }

  smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.client.expire(key, ttlSeconds);
    return result === 1;
  }
}

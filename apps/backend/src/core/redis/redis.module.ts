import { Global, Module } from '@nestjs/common';

import { REDIS_CLIENT } from '~/core/redis/domain/ports/redis.client.port';
import { IoRedisClient } from '~/core/redis/infrastructure/ioredis.client';

@Global()
@Module({
  providers: [
    IoRedisClient,
    {
      provide: REDIS_CLIENT,
      useExisting: IoRedisClient,
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}

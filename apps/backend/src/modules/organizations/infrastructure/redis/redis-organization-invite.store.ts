import { Inject, Injectable } from '@nestjs/common';

import {
  REDIS_CLIENT,
  type IRedisClient,
} from '~/core/redis/domain/ports/redis.client.port';
import { organizationInviteRedisKey } from '~/modules/organizations/domain/constants/organization-invite';
import type {
  IOrganizationInviteStore,
  OrganizationInvitePayload,
} from '~/modules/organizations/domain/ports/organization-invite.store.port';

@Injectable()
export class RedisOrganizationInviteStore implements IOrganizationInviteStore {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: IRedisClient,
  ) {}

  async save(
    token: string,
    payload: OrganizationInvitePayload,
    ttlSeconds: number,
  ): Promise<void> {
    await this.redis.set(
      organizationInviteRedisKey(token),
      JSON.stringify(payload),
      ttlSeconds,
    );
  }

  async get(token: string): Promise<OrganizationInvitePayload | null> {
    const raw = await this.redis.get(organizationInviteRedisKey(token));
    return this.parse(raw);
  }

  async consume(token: string): Promise<OrganizationInvitePayload | null> {
    const raw = await this.redis.getdel(organizationInviteRedisKey(token));
    return this.parse(raw);
  }

  private parse(raw: string | null): OrganizationInvitePayload | null {
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as OrganizationInvitePayload;
  }
}

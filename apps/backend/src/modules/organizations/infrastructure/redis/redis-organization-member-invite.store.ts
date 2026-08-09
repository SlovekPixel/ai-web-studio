import { Inject, Injectable } from '@nestjs/common';

import {
  REDIS_CLIENT,
  type IRedisClient,
} from '~/core/redis/domain/ports/redis.client.port';
import {
  organizationMemberInviteOrgKey,
  organizationMemberInviteTokenKey,
} from '~/modules/organizations/domain/constants/organization-member-invite';
import type {
  IOrganizationMemberInviteStore,
  OrganizationMemberInvitePayload,
} from '~/modules/organizations/domain/ports/organization-member-invite.store.port';

@Injectable()
export class RedisOrganizationMemberInviteStore implements IOrganizationMemberInviteStore {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: IRedisClient,
  ) {}

  async replace(
    organizationUuid: string,
    token: string,
    payload: OrganizationMemberInvitePayload,
    ttlSeconds: number,
  ): Promise<void> {
    const orgKey = organizationMemberInviteOrgKey(organizationUuid);
    const previousToken = await this.redis.get(orgKey);

    if (previousToken) {
      await this.redis.del(organizationMemberInviteTokenKey(previousToken));
    }

    await this.redis.del(orgKey);
    await this.redis.set(
      organizationMemberInviteTokenKey(token),
      JSON.stringify(payload),
      ttlSeconds,
    );
    await this.redis.set(orgKey, token, ttlSeconds);
  }

  async get(token: string): Promise<OrganizationMemberInvitePayload | null> {
    const raw = await this.redis.get(organizationMemberInviteTokenKey(token));
    return this.parse(raw);
  }

  async consume(
    token: string,
  ): Promise<OrganizationMemberInvitePayload | null> {
    const raw = await this.redis.getdel(
      organizationMemberInviteTokenKey(token),
    );
    const payload = this.parse(raw);

    if (!payload) {
      return null;
    }

    const orgKey = organizationMemberInviteOrgKey(payload.organizationUuid);
    const currentToken = await this.redis.get(orgKey);

    if (currentToken === token) {
      await this.redis.del(orgKey);
    }

    return payload;
  }

  private parse(raw: string | null): OrganizationMemberInvitePayload | null {
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as OrganizationMemberInvitePayload;
  }
}

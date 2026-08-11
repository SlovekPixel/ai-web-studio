import type { PublicOrganizationType } from '@repo/types';

export class Organization {
  constructor(
    public readonly uuid: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly inn: string | null,
    public readonly ownerId: string,
    public readonly active: boolean,
    public readonly maxMembers: number,
    public readonly currentMembersAll: number,
    public readonly currentMembersActive: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  toPublic(): PublicOrganizationType {
    return {
      uuid: this.uuid,
      name: this.name,
      description: this.description,
      inn: this.inn,
      ownerId: this.ownerId,
      active: this.active,
      maxMembers: this.maxMembers,
      currentMembersAll: this.currentMembersAll,
      currentMembersActive: this.currentMembersActive,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  withMemberCounts(counts: { all: number; active: number }): Organization {
    return new Organization(
      this.uuid,
      this.name,
      this.description,
      this.inn,
      this.ownerId,
      this.active,
      this.maxMembers,
      counts.all,
      counts.active,
      this.createdAt,
      this.updatedAt,
    );
  }
}

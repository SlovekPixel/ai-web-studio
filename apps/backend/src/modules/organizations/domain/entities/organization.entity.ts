import type { PublicOrganizationType } from '@repo/types';

export class Organization {
  constructor(
    public readonly uuid: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly inn: string | null,
    public readonly ownerId: string,
    public readonly active: boolean,
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
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

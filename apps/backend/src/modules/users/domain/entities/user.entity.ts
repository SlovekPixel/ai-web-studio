import type { PublicUserType } from '@repo/types';

import type { Organization } from '~/modules/organizations/domain/entities/organization.entity';

export class User {
  constructor(
    public readonly id: string,
    public readonly login: string,
    public readonly hashPassword: string,
    public readonly email: string | null,
    public readonly fullName: string,
    public readonly active: boolean,
    public readonly orgId: string | null,
    public readonly organization: Organization | null,
    public readonly loginAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  toPublic(): PublicUserType {
    return {
      id: this.id,
      login: this.login,
      email: this.email,
      fullName: this.fullName,
      active: this.active,
      orgId: this.orgId,
      isAdmin: this.orgId === null,
      organization: this.organization ? this.organization.toPublic() : null,
      loginAt: this.loginAt ? this.loginAt.toISOString() : null,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

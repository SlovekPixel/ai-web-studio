import type {
  Organization,
  PublicOrganization,
} from '~/modules/organizations/domain/entities/organization.entity';

export interface PublicUser {
  id: string;
  login: string;
  email: string | null;
  fullName: string;
  active: boolean;
  orgId: string | null;
  organization: PublicOrganization | null;
  loginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

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

  toPublic(): PublicUser {
    return {
      id: this.id,
      login: this.login,
      email: this.email,
      fullName: this.fullName,
      active: this.active,
      orgId: this.orgId,
      organization: this.organization ? this.organization.toPublic() : null,
      loginAt: this.loginAt ? this.loginAt.toISOString() : null,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

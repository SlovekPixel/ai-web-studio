import type { Organization } from '~/modules/organizations/domain/entities/organization.entity';

export interface CreateOrganizationData {
  name: string;
  description: string | null;
  inn: string | null;
  ownerId: string;
}

export interface UpdateOrganizationData {
  name?: string;
  description?: string | null;
}

export interface IOrganizationRepository {
  findAll(): Promise<Organization[]>;
  findByUuid(uuid: string): Promise<Organization | null>;
  findByName(name: string): Promise<Organization | null>;
  findByInn(inn: string): Promise<Organization | null>;
  create(data: CreateOrganizationData): Promise<Organization>;
  update(uuid: string, data: UpdateOrganizationData): Promise<Organization>;
}

export const ORGANIZATION_REPOSITORY = Symbol('ORGANIZATION_REPOSITORY');

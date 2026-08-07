import type {
  CreateOrganizationRequestType,
  UpdateOrganizationRequestType,
} from '@repo/types';

import type { Organization } from '~/modules/organizations/domain/entities/organization.entity';

/** Normalized create payload after HTTP optional fields are resolved to null. */
export type CreateOrganizationData = {
  name: CreateOrganizationRequestType['name'];
  ownerId: CreateOrganizationRequestType['ownerId'];
  description: string | null;
  inn: string | null;
};

export type UpdateOrganizationData = UpdateOrganizationRequestType;

export interface IOrganizationRepository {
  findAll(): Promise<Organization[]>;
  findByUuid(uuid: string): Promise<Organization | null>;
  findByName(name: string): Promise<Organization | null>;
  findByInn(inn: string): Promise<Organization | null>;
  create(data: CreateOrganizationData): Promise<Organization>;
  update(uuid: string, data: UpdateOrganizationData): Promise<Organization>;
}

export const ORGANIZATION_REPOSITORY = Symbol('ORGANIZATION_REPOSITORY');

import { Inject, Injectable } from '@nestjs/common';

import type { PublicOrganizationType } from '@repo/types';

import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '~/modules/organizations/domain/ports/organization.repository.port';

@Injectable()
export class FindAllOrganizationsUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(): Promise<PublicOrganizationType[]> {
    const organizations = await this.organizationRepository.findAll();

    return organizations.map((organization) => organization.toPublic());
  }
}

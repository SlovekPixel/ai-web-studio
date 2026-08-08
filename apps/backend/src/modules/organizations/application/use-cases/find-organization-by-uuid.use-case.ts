import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { PublicOrganizationType } from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '~/modules/organizations/domain/ports/organization.repository.port';

@Injectable()
export class FindOrganizationByUuidUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(uuid: string): Promise<PublicOrganizationType> {
    const organization = await this.organizationRepository.findByUuid(uuid);

    if (!organization) {
      throw new NotFoundException(
        this.i18nService.translate('ERRORS.ORGANIZATION_NOT_FOUND', {
          organizationUuid: uuid,
        }),
      );
    }

    return organization.toPublic();
  }
}

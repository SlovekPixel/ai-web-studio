import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { PublicOrganizationType } from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
  type UpdateOrganizationData,
} from '~/modules/organizations/domain/ports/organization.repository.port';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(
    uuid: string,
    data: UpdateOrganizationData,
  ): Promise<PublicOrganizationType> {
    const organization = await this.organizationRepository.findByUuid(uuid);

    if (!organization) {
      throw new NotFoundException(
        this.i18nService.translate('ERRORS.ORGANIZATION_NOT_FOUND', {
          organizationUuid: uuid,
        }),
      );
    }

    if (data.name !== undefined && data.name !== organization.name) {
      const existingByName = await this.organizationRepository.findByName(
        data.name,
      );

      if (existingByName) {
        throw new ConflictException(
          this.i18nService.translate('ERRORS.ORGANIZATION_NAME_TAKEN', {
            name: data.name,
          }),
        );
      }
    }

    const updated = await this.organizationRepository.update(uuid, data);

    return updated.toPublic();
  }
}

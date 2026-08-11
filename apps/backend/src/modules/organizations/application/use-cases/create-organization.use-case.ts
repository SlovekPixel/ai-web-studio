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
  type CreateOrganizationData,
  type IOrganizationRepository,
} from '~/modules/organizations/domain/ports/organization.repository.port';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '~/modules/users/domain/ports/user.repository.port';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(data: CreateOrganizationData): Promise<PublicOrganizationType> {
    const owner = await this.userRepository.findById(data.ownerId);

    if (!owner) {
      throw new NotFoundException(
        this.i18nService.translate('ERRORS.USER_NOT_FOUND', {
          userId: data.ownerId,
        }),
      );
    }

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

    if (data.inn) {
      const existingByInn = await this.organizationRepository.findByInn(
        data.inn,
      );

      if (existingByInn) {
        throw new ConflictException(
          this.i18nService.translate('ERRORS.ORGANIZATION_INN_TAKEN', {
            inn: data.inn,
          }),
        );
      }
    }

    const organization = await this.organizationRepository.create(data);
    await this.userRepository.updateOrgId(data.ownerId, organization.uuid);

    const created = await this.organizationRepository.findByUuid(
      organization.uuid,
    );

    if (!created) {
      throw new NotFoundException(
        this.i18nService.translate('ERRORS.ORGANIZATION_NOT_FOUND', {
          organizationUuid: organization.uuid,
        }),
      );
    }

    return created.toPublic();
  }
}

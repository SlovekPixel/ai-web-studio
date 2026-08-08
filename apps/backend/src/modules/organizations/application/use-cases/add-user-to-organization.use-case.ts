import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { PublicUserType } from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '~/modules/organizations/domain/ports/organization.repository.port';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '~/modules/users/domain/ports/user.repository.port';

@Injectable()
export class AddUserToOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(
    organizationUuid: string,
    userId: string,
  ): Promise<PublicUserType> {
    const organization =
      await this.organizationRepository.findByUuid(organizationUuid);

    if (!organization) {
      throw new NotFoundException(
        this.i18nService.translate('ERRORS.ORGANIZATION_NOT_FOUND', {
          organizationUuid,
        }),
      );
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(
        this.i18nService.translate('ERRORS.USER_NOT_FOUND', {
          userId,
        }),
      );
    }

    const updated = await this.userRepository.updateOrgId(
      userId,
      organizationUuid,
    );

    return updated.toPublic();
  }
}

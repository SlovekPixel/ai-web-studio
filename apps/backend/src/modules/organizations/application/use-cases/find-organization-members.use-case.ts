import { ForbiddenException, Inject, Injectable } from '@nestjs/common';

import type { PublicUserType } from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '~/modules/users/domain/ports/user.repository.port';

@Injectable()
export class FindOrganizationMembersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(currentUser: PublicUserType): Promise<PublicUserType[]> {
    if (!currentUser.orgId) {
      throw new ForbiddenException(
        this.i18nService.translate('ERRORS.FORBIDDEN'),
      );
    }

    const members = await this.userRepository.findByOrgId(currentUser.orgId);

    return members.map((user) => user.toPublic());
  }
}

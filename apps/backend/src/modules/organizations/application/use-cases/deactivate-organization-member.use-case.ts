import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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
export class DeactivateOrganizationMemberUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(
    currentUser: PublicUserType,
    memberId: string,
  ): Promise<PublicUserType> {
    if (!currentUser.isOrgOwner || !currentUser.orgId) {
      throw new ForbiddenException(
        this.i18nService.translate('ERRORS.FORBIDDEN'),
      );
    }

    if (memberId === currentUser.id) {
      throw new ForbiddenException(
        this.i18nService.translate('ERRORS.FORBIDDEN'),
      );
    }

    const member = await this.userRepository.findById(memberId);

    if (!member || member.orgId !== currentUser.orgId) {
      throw new NotFoundException(
        this.i18nService.translate('ERRORS.USER_NOT_FOUND', {
          userId: memberId,
        }),
      );
    }

    if (member.id === member.organization?.ownerId) {
      throw new ForbiddenException(
        this.i18nService.translate('ERRORS.FORBIDDEN'),
      );
    }

    if (!member.active) {
      return member.toPublic();
    }

    const updated = await this.userRepository.updateActive(memberId, false);
    return updated.toPublic();
  }
}

import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';

import type {
  OrganizationMemberInviteResponseType,
  PublicUserType,
} from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  ORGANIZATION_MEMBER_INVITE_TTL_SECONDS,
  buildOrganizationMemberInvitePath,
} from '~/modules/organizations/domain/constants/organization-member-invite';
import {
  ORGANIZATION_MEMBER_INVITE_STORE,
  type IOrganizationMemberInviteStore,
} from '~/modules/organizations/domain/ports/organization-member-invite.store.port';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '~/modules/organizations/domain/ports/organization.repository.port';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '~/modules/users/domain/ports/user.repository.port';

@Injectable()
export class CreateOrganizationMemberInviteUseCase {
  constructor(
    @Inject(ORGANIZATION_MEMBER_INVITE_STORE)
    private readonly inviteStore: IOrganizationMemberInviteStore,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(
    currentUser: PublicUserType,
  ): Promise<OrganizationMemberInviteResponseType> {
    if (
      !currentUser.isOrgOwner ||
      !currentUser.orgId ||
      !currentUser.organization
    ) {
      throw new ForbiddenException(
        this.i18nService.translate('ERRORS.FORBIDDEN'),
      );
    }

    const organization = await this.organizationRepository.findByUuid(
      currentUser.orgId,
    );

    if (!organization) {
      throw new NotFoundException(
        this.i18nService.translate('ERRORS.ORGANIZATION_NOT_FOUND', {
          organizationUuid: currentUser.orgId,
        }),
      );
    }

    const counts = await this.userRepository.countByOrgId(organization.uuid);

    if (counts.active >= organization.maxMembers) {
      throw new ConflictException(
        this.i18nService.translate('ERRORS.ORGANIZATION_MEMBER_LIMIT_REACHED'),
      );
    }

    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(
      Date.now() + ORGANIZATION_MEMBER_INVITE_TTL_SECONDS * 1000,
    ).toISOString();

    await this.inviteStore.replace(
      currentUser.orgId,
      token,
      {
        organizationUuid: currentUser.orgId,
        organizationName: organization.name,
        expiresAt,
      },
      ORGANIZATION_MEMBER_INVITE_TTL_SECONDS,
    );

    return {
      token,
      expiresAt,
      invitePath: buildOrganizationMemberInvitePath(token),
    };
  }
}

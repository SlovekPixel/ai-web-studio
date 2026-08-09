import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

import type { OrganizationInviteResponseType } from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  ORGANIZATION_INVITE_TTL_SECONDS,
  buildOrganizationInvitePath,
} from '~/modules/organizations/domain/constants/organization-invite';
import {
  ORGANIZATION_INVITE_STORE,
  type IOrganizationInviteStore,
} from '~/modules/organizations/domain/ports/organization-invite.store.port';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '~/modules/organizations/domain/ports/organization.repository.port';

@Injectable()
export class CreateOrganizationInviteUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(ORGANIZATION_INVITE_STORE)
    private readonly inviteStore: IOrganizationInviteStore,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(name: string): Promise<OrganizationInviteResponseType> {
    const existingByName = await this.organizationRepository.findByName(name);

    if (existingByName) {
      throw new ConflictException(
        this.i18nService.translate('ERRORS.ORGANIZATION_NAME_TAKEN', {
          name,
        }),
      );
    }

    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(
      Date.now() + ORGANIZATION_INVITE_TTL_SECONDS * 1000,
    ).toISOString();

    await this.inviteStore.save(
      token,
      { name, expiresAt },
      ORGANIZATION_INVITE_TTL_SECONDS,
    );

    return {
      token,
      expiresAt,
      invitePath: buildOrganizationInvitePath(token),
    };
  }
}

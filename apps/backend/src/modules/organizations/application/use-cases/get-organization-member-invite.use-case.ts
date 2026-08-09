import { GoneException, Inject, Injectable } from '@nestjs/common';

import type { OrganizationMemberInvitePreviewType } from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  ORGANIZATION_MEMBER_INVITE_STORE,
  type IOrganizationMemberInviteStore,
} from '~/modules/organizations/domain/ports/organization-member-invite.store.port';

@Injectable()
export class GetOrganizationMemberInviteUseCase {
  constructor(
    @Inject(ORGANIZATION_MEMBER_INVITE_STORE)
    private readonly inviteStore: IOrganizationMemberInviteStore,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(token: string): Promise<OrganizationMemberInvitePreviewType> {
    const invite = await this.inviteStore.get(token);

    if (!invite) {
      throw new GoneException(
        this.i18nService.translate('ERRORS.ORGANIZATION_INVITE_INVALID'),
      );
    }

    return {
      organizationName: invite.organizationName,
      expiresAt: invite.expiresAt,
    };
  }
}

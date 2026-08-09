import { GoneException, Inject, Injectable } from '@nestjs/common';

import type { OrganizationInvitePreviewType } from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  ORGANIZATION_INVITE_STORE,
  type IOrganizationInviteStore,
} from '~/modules/organizations/domain/ports/organization-invite.store.port';

@Injectable()
export class GetOrganizationInviteUseCase {
  constructor(
    @Inject(ORGANIZATION_INVITE_STORE)
    private readonly inviteStore: IOrganizationInviteStore,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(token: string): Promise<OrganizationInvitePreviewType> {
    const invite = await this.inviteStore.get(token);

    if (!invite) {
      throw new GoneException(
        this.i18nService.translate('ERRORS.ORGANIZATION_INVITE_INVALID'),
      );
    }

    return {
      organizationName: invite.name,
      expiresAt: invite.expiresAt,
    };
  }
}

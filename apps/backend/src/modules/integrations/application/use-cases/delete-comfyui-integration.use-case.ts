import { ForbiddenException, Inject, Injectable } from '@nestjs/common';

import type { ComfyUiIntegrationStatusType, PublicUserType } from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  COMFYUI_INTEGRATION_REPOSITORY,
  type IComfyUiIntegrationRepository,
} from '~/modules/integrations/domain/ports/comfyui-integration.repository.port';

@Injectable()
export class DeleteComfyUiIntegrationUseCase {
  constructor(
    @Inject(COMFYUI_INTEGRATION_REPOSITORY)
    private readonly comfyUiIntegrationRepository: IComfyUiIntegrationRepository,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(
    currentUser: PublicUserType,
  ): Promise<ComfyUiIntegrationStatusType> {
    if (
      !currentUser.isOrgOwner ||
      !currentUser.orgId ||
      !currentUser.organization
    ) {
      throw new ForbiddenException(
        this.i18nService.translate('ERRORS.FORBIDDEN'),
      );
    }

    await this.comfyUiIntegrationRepository.deleteByOrgId(currentUser.orgId);

    return { connected: false };
  }
}

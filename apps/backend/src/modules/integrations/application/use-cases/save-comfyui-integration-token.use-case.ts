import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import type { PublicComfyUiIntegrationType } from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  COMFYUI_INTEGRATION_REPOSITORY,
  type IComfyUiIntegrationRepository,
} from '~/modules/integrations/domain/ports/comfyui-integration.repository.port';

@Injectable()
export class SaveComfyUiIntegrationTokenUseCase {
  constructor(
    @Inject(COMFYUI_INTEGRATION_REPOSITORY)
    private readonly comfyUiIntegrationRepository: IComfyUiIntegrationRepository,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(
    orgId: string | null,
    token: string,
  ): Promise<PublicComfyUiIntegrationType> {
    if (!orgId) {
      throw new BadRequestException(
        this.i18nService.translate('ERRORS.USER_HAS_NO_ORGANIZATION'),
      );
    }

    const comfyUiIntegration = await this.comfyUiIntegrationRepository.save({
      orgId,
      token,
    });
    return comfyUiIntegration.toPublic();
  }
}

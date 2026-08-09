import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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
export class GetComfyUiIntegrationTokenUseCase {
  constructor(
    @Inject(COMFYUI_INTEGRATION_REPOSITORY)
    private readonly comfyUiIntegrationRepository: IComfyUiIntegrationRepository,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(orgId: string | null): Promise<PublicComfyUiIntegrationType> {
    if (!orgId) {
      throw new BadRequestException(
        this.i18nService.translate('ERRORS.USER_HAS_NO_ORGANIZATION'),
      );
    }

    const comfyUiIntegration =
      await this.comfyUiIntegrationRepository.findByOrgId(orgId);

    if (!comfyUiIntegration) {
      throw new NotFoundException(
        this.i18nService.translate(
          'ERRORS.COMFYUI_INTEGRATION_TOKEN_NOT_FOUND',
        ),
      );
    }

    return comfyUiIntegration.toPublic();
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GetComfyUiIntegrationTokenUseCase } from '~/modules/integrations/application/use-cases/get-comfyui-integration-token.use-case';
import { SaveComfyUiIntegrationTokenUseCase } from '~/modules/integrations/application/use-cases/save-comfyui-integration-token.use-case';
import { COMFYUI_INTEGRATION_REPOSITORY } from '~/modules/integrations/domain/ports/comfyui-integration.repository.port';
import { ComfyUiIntegrationOrmEntity } from '~/modules/integrations/infrastructure/persistence/typeorm/comfyui-integration.orm-entity';
import { TypeOrmComfyUiIntegrationRepository } from '~/modules/integrations/infrastructure/persistence/typeorm/typeorm-comfyui-integration.repository';
import { ComfyUiIntegrationController } from '~/modules/integrations/presentation/http/comfyui-integration.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ComfyUiIntegrationOrmEntity])],
  controllers: [ComfyUiIntegrationController],
  providers: [
    GetComfyUiIntegrationTokenUseCase,
    SaveComfyUiIntegrationTokenUseCase,
    {
      provide: COMFYUI_INTEGRATION_REPOSITORY,
      useClass: TypeOrmComfyUiIntegrationRepository,
    },
  ],
  exports: [COMFYUI_INTEGRATION_REPOSITORY],
})
export class IntegrationsModule {}

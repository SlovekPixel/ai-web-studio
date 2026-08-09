import type { ComfyUiIntegration } from '~/modules/integrations/domain/entities/comfyui-integration.entity';

export type SaveComfyUiIntegrationTokenData = {
  orgId: string;
  token: string;
};

export interface IComfyUiIntegrationRepository {
  findByOrgId(orgId: string): Promise<ComfyUiIntegration | null>;
  save(data: SaveComfyUiIntegrationTokenData): Promise<ComfyUiIntegration>;
  deleteByOrgId(orgId: string): Promise<void>;
}

export const COMFYUI_INTEGRATION_REPOSITORY = Symbol(
  'COMFYUI_INTEGRATION_REPOSITORY',
);

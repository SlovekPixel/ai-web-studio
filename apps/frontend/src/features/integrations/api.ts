import {
  ComfyUiIntegrationStatusSchema,
  SaveComfyUiIntegrationTokenRequestSchema,
  type ComfyUiIntegrationStatusType,
  type SaveComfyUiIntegrationTokenRequestType,
} from "@repo/types";

import { api } from "@/lib/api/client";
import { apiRoutes } from "@/lib/api/routes";

export const integrationsApi = {
  getComfyUiStatus(): Promise<ComfyUiIntegrationStatusType> {
    return api.get(apiRoutes.integrations.comfyui, {
      responseSchema: ComfyUiIntegrationStatusSchema,
    });
  },

  saveComfyUiToken(
    body: SaveComfyUiIntegrationTokenRequestType,
  ): Promise<ComfyUiIntegrationStatusType> {
    return api.put(apiRoutes.integrations.comfyui, {
      body,
      bodySchema: SaveComfyUiIntegrationTokenRequestSchema,
      responseSchema: ComfyUiIntegrationStatusSchema,
    });
  },

  deleteComfyUiIntegration(): Promise<ComfyUiIntegrationStatusType> {
    return api.delete(apiRoutes.integrations.comfyui, {
      responseSchema: ComfyUiIntegrationStatusSchema,
    });
  },
};

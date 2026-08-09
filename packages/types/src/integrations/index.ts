import { z } from 'zod';

export * from './schemas';

import {
  PublicComfyUiIntegrationSchema,
  SaveComfyUiIntegrationTokenRequestSchema,
} from './schemas';

export type PublicComfyUiIntegrationType = z.infer<
  typeof PublicComfyUiIntegrationSchema
>;
export type SaveComfyUiIntegrationTokenRequestType = z.infer<
  typeof SaveComfyUiIntegrationTokenRequestSchema
>;

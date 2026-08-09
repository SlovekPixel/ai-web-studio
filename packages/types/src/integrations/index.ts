import { z } from 'zod';

export * from './schemas';

import {
  ComfyUiIntegrationStatusSchema,
  SaveComfyUiIntegrationTokenRequestSchema,
} from './schemas';

export type ComfyUiIntegrationStatusType = z.infer<
  typeof ComfyUiIntegrationStatusSchema
>;
export type SaveComfyUiIntegrationTokenRequestType = z.infer<
  typeof SaveComfyUiIntegrationTokenRequestSchema
>;

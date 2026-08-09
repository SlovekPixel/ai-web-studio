import { z } from 'zod';

export const comfyUiIntegrationTokenSchema = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .meta({ title: 'ComfyUI Token', example: 'comfyui-api-token' });

export const ComfyUiIntegrationStatusSchema = z.object({
  connected: z.boolean().meta({
    title: 'Connected',
    example: true,
  }),
});

export const SaveComfyUiIntegrationTokenRequestSchema = z.object({
  token: comfyUiIntegrationTokenSchema,
});

import { z } from 'zod';

const uuidExample = '123e4567-e89b-12d3-a456-426614174000';

export const comfyUiIntegrationTokenSchema = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .meta({ title: 'ComfyUI Token', example: 'comfyui-api-token' });

export const PublicComfyUiIntegrationSchema = z.object({
  orgId: z.uuid().meta({
    title: 'Organization ID',
    example: uuidExample,
  }),
  token: comfyUiIntegrationTokenSchema,
  createdAt: z.iso
    .datetime()
    .meta({ title: 'Created At', example: '2026-01-01T00:00:00.000Z' }),
  updatedAt: z.iso
    .datetime()
    .meta({ title: 'Updated At', example: '2026-01-01T00:00:00.000Z' }),
});

export const SaveComfyUiIntegrationTokenRequestSchema = z.object({
  token: comfyUiIntegrationTokenSchema,
});

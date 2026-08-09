import { PublicComfyUiIntegrationSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export const ComfyUiIntegrationResponseSchema = PublicComfyUiIntegrationSchema;

export class ComfyUiIntegrationResponseDto extends createZodDto(
  ComfyUiIntegrationResponseSchema,
) {}

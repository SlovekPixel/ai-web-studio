import { ComfyUiIntegrationStatusSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export const ComfyUiIntegrationStatusResponseSchema =
  ComfyUiIntegrationStatusSchema;

export class ComfyUiIntegrationStatusResponseDto extends createZodDto(
  ComfyUiIntegrationStatusResponseSchema,
) {}

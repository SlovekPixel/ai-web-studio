import { SaveComfyUiIntegrationTokenRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export { SaveComfyUiIntegrationTokenRequestSchema };

export class SaveComfyUiIntegrationTokenRequestDto extends createZodDto(
  SaveComfyUiIntegrationTokenRequestSchema,
) {}

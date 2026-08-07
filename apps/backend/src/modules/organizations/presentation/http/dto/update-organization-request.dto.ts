import { UpdateOrganizationRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export { UpdateOrganizationRequestSchema };

export class UpdateOrganizationRequestDto extends createZodDto(
  UpdateOrganizationRequestSchema,
) {}

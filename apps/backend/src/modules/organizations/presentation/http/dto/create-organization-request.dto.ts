import { CreateOrganizationRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export { CreateOrganizationRequestSchema };

export class CreateOrganizationRequestDto extends createZodDto(
  CreateOrganizationRequestSchema,
) {}

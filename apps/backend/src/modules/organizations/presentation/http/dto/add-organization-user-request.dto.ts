import { AddOrganizationUserRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export { AddOrganizationUserRequestSchema };

export class AddOrganizationUserRequestDto extends createZodDto(
  AddOrganizationUserRequestSchema,
) {}

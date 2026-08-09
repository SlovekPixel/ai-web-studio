import { CreateOrganizationInviteRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export { CreateOrganizationInviteRequestSchema };

export class CreateOrganizationInviteRequestDto extends createZodDto(
  CreateOrganizationInviteRequestSchema,
) {}

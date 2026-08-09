import { OrganizationInviteResponseSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class OrganizationInviteResponseDto extends createZodDto(
  OrganizationInviteResponseSchema,
) {}

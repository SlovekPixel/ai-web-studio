import { OrganizationMemberInviteResponseSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class OrganizationMemberInviteResponseDto extends createZodDto(
  OrganizationMemberInviteResponseSchema,
) {}

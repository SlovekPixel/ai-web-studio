import { OrganizationMemberInvitePreviewSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class OrganizationMemberInvitePreviewDto extends createZodDto(
  OrganizationMemberInvitePreviewSchema,
) {}

import { OrganizationInvitePreviewSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class OrganizationInvitePreviewDto extends createZodDto(
  OrganizationInvitePreviewSchema,
) {}

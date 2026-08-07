import { PublicOrganizationSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export const OrganizationResponseSchema = PublicOrganizationSchema;

export class OrganizationResponseDto extends createZodDto(
  OrganizationResponseSchema,
) {}

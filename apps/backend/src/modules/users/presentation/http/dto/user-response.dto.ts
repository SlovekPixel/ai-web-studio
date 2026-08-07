import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { OrganizationResponseSchema } from '~/modules/organizations/presentation/http/dto/organization-response.dto';

export const UserResponseSchema = z.object({
  id: z.uuid().meta({
    title: 'ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  login: z.string().meta({ title: 'Login', example: 'Frank' }),
  email: z
    .email()
    .nullable()
    .meta({ title: 'Email', example: 'frank@example.com' }),
  fullName: z.string().meta({ title: 'Full Name', example: 'Frank Ocean' }),
  active: z.boolean().meta({ title: 'Active', example: true }),
  orgId: z.uuid().nullable().meta({
    title: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  organization: OrganizationResponseSchema.nullable().meta({
    title: 'Organization',
  }),
  loginAt: z.iso
    .datetime()
    .nullable()
    .meta({ title: 'Login At', example: '2026-01-01T00:00:00.000Z' }),
  createdAt: z.iso
    .datetime()
    .meta({ title: 'Created At', example: '2026-01-01T00:00:00.000Z' }),
  updatedAt: z.iso
    .datetime()
    .meta({ title: 'Updated At', example: '2026-01-01T00:00:00.000Z' }),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}

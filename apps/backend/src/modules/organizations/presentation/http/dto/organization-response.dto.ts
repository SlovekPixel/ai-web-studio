import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const OrganizationResponseSchema = z.object({
  uuid: z.uuid().meta({
    title: 'UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  name: z.string().meta({ title: 'Name', example: 'Acme Corp' }),
  description: z
    .string()
    .nullable()
    .meta({ title: 'Description', example: 'Software company' }),
  inn: z.string().nullable().meta({ title: 'INN', example: '7707083893' }),
  ownerId: z.uuid().meta({
    title: 'Owner ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  active: z.boolean().meta({ title: 'Active', example: true }),
  createdAt: z.iso
    .datetime()
    .meta({ title: 'Created At', example: '2026-01-01T00:00:00.000Z' }),
  updatedAt: z.iso
    .datetime()
    .meta({ title: 'Updated At', example: '2026-01-01T00:00:00.000Z' }),
});

export class OrganizationResponseDto extends createZodDto(
  OrganizationResponseSchema,
) {}

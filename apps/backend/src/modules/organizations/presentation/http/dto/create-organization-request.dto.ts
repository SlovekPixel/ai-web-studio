import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateOrganizationRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .meta({ title: 'Name', example: 'Acme Corp' }),
  description: z
    .string()
    .trim()
    .max(5000)
    .nullable()
    .optional()
    .meta({ title: 'Description', example: 'Software company' }),
  inn: z
    .string()
    .trim()
    .regex(/^\d{10}(\d{2})?$/, 'INN must be 10 or 12 digits')
    .nullable()
    .optional()
    .meta({ title: 'INN', example: '7707083893' }),
  ownerId: z.uuid().meta({
    title: 'Owner ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

export class CreateOrganizationRequestDto extends createZodDto(
  CreateOrganizationRequestSchema,
) {}

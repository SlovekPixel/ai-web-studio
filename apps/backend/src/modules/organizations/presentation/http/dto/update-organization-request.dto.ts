import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateOrganizationRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .optional()
    .meta({ title: 'Name', example: 'Acme Corp' }),
  description: z
    .string()
    .trim()
    .max(5000)
    .nullable()
    .optional()
    .meta({ title: 'Description', example: 'Software company' }),
});

export class UpdateOrganizationRequestDto extends createZodDto(
  UpdateOrganizationRequestSchema,
) {}

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AddOrganizationUserRequestSchema = z.object({
  userId: z.uuid().meta({
    title: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

export class AddOrganizationUserRequestDto extends createZodDto(
  AddOrganizationUserRequestSchema,
) {}

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserResponseSchema = z.object({
  uuid: z.uuid().meta({ title: 'UUID', example: '123e4567-e89b-12d3-a456-426614174000' }),
  login: z.string().meta({ title: 'Login', example: 'Frank' }),
  createdAt: z.iso.datetime().meta({ title: 'Created At', example: '2026-01-01T00:00:00.000Z' }),
  updatedAt: z.iso.datetime().meta({ title: 'Updated At', example: '2026-01-01T00:00:00.000Z' }),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}

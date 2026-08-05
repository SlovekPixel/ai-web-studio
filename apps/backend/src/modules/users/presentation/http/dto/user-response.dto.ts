import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserResponseSchema = z.object({
  uuid: z.uuid(),
  login: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}

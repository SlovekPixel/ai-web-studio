import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const RegisterRequestSchema = z.object({
  login: z.string().trim().min(3).max(64),
  password: z.string().min(8).max(128),
});

export class RegisterRequestDto extends createZodDto(RegisterRequestSchema) {}

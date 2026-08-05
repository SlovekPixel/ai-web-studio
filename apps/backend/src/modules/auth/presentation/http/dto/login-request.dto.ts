import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LoginRequestSchema = z.object({
  login: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(128),
});

export class LoginRequestDto extends createZodDto(LoginRequestSchema) {}

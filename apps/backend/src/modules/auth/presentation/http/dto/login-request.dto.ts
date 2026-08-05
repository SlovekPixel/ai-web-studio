import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LoginRequestSchema = z.object({
  login: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .meta({ title: 'Login', example: 'Frank' }),
  password: z
    .string()
    .min(1)
    .max(128)
    .meta({ title: 'Password', example: 'password123' }),
});

export class LoginRequestDto extends createZodDto(LoginRequestSchema) {}

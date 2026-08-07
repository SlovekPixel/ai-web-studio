import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const RegisterRequestSchema = z.object({
  login: z
    .string()
    .trim()
    .min(3)
    .max(64)
    .meta({ title: 'Login', example: 'Frank' }),
  password: z
    .string()
    .min(8)
    .max(128)
    .meta({ title: 'Password', example: 'password123' }),
  fullName: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .meta({ title: 'Full Name', example: 'Frank Ocean' }),
});

export class RegisterRequestDto extends createZodDto(RegisterRequestSchema) {}

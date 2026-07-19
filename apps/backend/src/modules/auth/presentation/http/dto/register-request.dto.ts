import { RegisterRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class RegisterRequestDto extends createZodDto(RegisterRequestSchema) {}

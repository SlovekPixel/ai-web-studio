import { AuthRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class AuthRequestDto extends createZodDto(AuthRequestSchema) {}

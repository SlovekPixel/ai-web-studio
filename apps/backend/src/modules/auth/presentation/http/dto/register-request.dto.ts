import { RegisterRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export { RegisterRequestSchema };

export class RegisterRequestDto extends createZodDto(RegisterRequestSchema) {}

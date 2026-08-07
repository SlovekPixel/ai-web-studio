import { LoginRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export { LoginRequestSchema };

export class LoginRequestDto extends createZodDto(LoginRequestSchema) {}

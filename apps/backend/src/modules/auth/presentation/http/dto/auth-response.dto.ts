import { AuthResponseSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class AuthResponseDto extends createZodDto(AuthResponseSchema) {}

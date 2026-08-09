import { ChangePasswordRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export { ChangePasswordRequestSchema };

export class ChangePasswordRequestDto extends createZodDto(
  ChangePasswordRequestSchema,
) {}

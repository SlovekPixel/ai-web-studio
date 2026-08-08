import { UpdateUserRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export { UpdateUserRequestSchema };

export class UpdateUserRequestDto extends createZodDto(
  UpdateUserRequestSchema,
) {}

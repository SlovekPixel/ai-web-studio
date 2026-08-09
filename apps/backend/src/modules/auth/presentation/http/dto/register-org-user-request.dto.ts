import { RegisterOrgUserRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export { RegisterOrgUserRequestSchema };

export class RegisterOrgUserRequestDto extends createZodDto(
  RegisterOrgUserRequestSchema,
) {}

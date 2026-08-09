import { RegisterOrgAdminRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export { RegisterOrgAdminRequestSchema };

export class RegisterOrgAdminRequestDto extends createZodDto(
  RegisterOrgAdminRequestSchema,
) {}

import { UpdateMeRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export { UpdateMeRequestSchema };

export class UpdateMeRequestDto extends createZodDto(UpdateMeRequestSchema) {}

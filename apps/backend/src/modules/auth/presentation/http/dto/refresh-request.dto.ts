import { RefreshRequestSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class RefreshRequestDto extends createZodDto(RefreshRequestSchema) {}

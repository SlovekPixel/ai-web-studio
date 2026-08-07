import { PublicUserSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export const UserResponseSchema = PublicUserSchema;

export class UserResponseDto extends createZodDto(UserResponseSchema) {}

import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AuthRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const RegisterRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const RefreshRequestSchema = z.object({
  refreshToken: z.string().min(1),
});

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserSchema,
});

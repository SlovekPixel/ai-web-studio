import { z } from 'zod';

export const AuthRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
});

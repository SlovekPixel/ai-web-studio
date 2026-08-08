import { z } from 'zod';

import {
  PublicUserSchema,
  userFullNameSchema,
  userLoginSchema,
} from '../user';

export const passwordSchema = z
  .string()
  .min(1)
  .max(128)
  .meta({ title: 'Password', example: 'password123' });

export const LoginRequestSchema = z.object({
  login: userLoginSchema,
  password: passwordSchema,
});

export const RegisterRequestSchema = z.object({
  login: userLoginSchema,
  password: passwordSchema,
  fullName: userFullNameSchema,
});

export const AccessTokenPayloadSchema = z.object({
  sub: z.uuid(),
  jti: z.uuid(),
  sid: z.uuid(),
  typ: z.literal('access'),
  user: PublicUserSchema,
});

export const RefreshTokenPayloadSchema = z.object({
  sub: z.uuid(),
  jti: z.uuid(),
  sid: z.uuid(),
  typ: z.literal('refresh'),
});

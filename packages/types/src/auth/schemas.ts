import { z } from 'zod';

import {
  organizationDescriptionSchema,
  organizationInnSchema,
} from '../organization/schemas';
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

export const RegisterOrgAdminRequestSchema = RegisterRequestSchema.extend({
  token: z.string().min(1).meta({
    title: 'Invite token',
    example: 'dGhpcy1pcy1hLXNhbXBsZS10b2tlbg',
  }),
  description: organizationDescriptionSchema.optional(),
  inn: organizationInnSchema.optional(),
});

export const RegisterOrgUserRequestSchema = RegisterRequestSchema.extend({
  token: z.string().min(1).meta({
    title: 'Member invite token',
    example: 'dGhpcy1pcy1hLXNhbXBsZS10b2tlbg',
  }),
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

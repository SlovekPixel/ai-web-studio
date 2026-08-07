import { z } from 'zod';

import {
  userFullNameSchema,
  userLoginSchema,
} from "../user";

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

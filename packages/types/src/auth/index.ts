import type { z } from 'zod';

export * from './schemas.js';

import {
  AuthRequestSchema,
  AuthResponseSchema,
  RefreshRequestSchema,
  RegisterRequestSchema,
  UserSchema,
} from './schemas.js';

export type UserType = z.infer<typeof UserSchema>;
export type AuthRequestType = z.infer<typeof AuthRequestSchema>;
export type RegisterRequestType = z.infer<typeof RegisterRequestSchema>;
export type RefreshRequestType = z.infer<typeof RefreshRequestSchema>;
export type AuthResponseType = z.infer<typeof AuthResponseSchema>;

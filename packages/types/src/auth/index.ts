import { z } from 'zod';

export * from './schemas';

import {
  AccessTokenPayloadSchema,
  LoginRequestSchema,
  RefreshTokenPayloadSchema,
  RegisterRequestSchema,
} from './schemas';

export type LoginRequestType = z.infer<typeof LoginRequestSchema>;
export type RegisterRequestType = z.infer<typeof RegisterRequestSchema>;
export type AccessTokenPayloadType = z.infer<typeof AccessTokenPayloadSchema>;
export type RefreshTokenPayloadType = z.infer<typeof RefreshTokenPayloadSchema>;

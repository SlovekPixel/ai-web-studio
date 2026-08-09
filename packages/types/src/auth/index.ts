import { z } from 'zod';

export * from './schemas';

import {
  AccessTokenPayloadSchema,
  ChangePasswordRequestSchema,
  LoginRequestSchema,
  RefreshTokenPayloadSchema,
  RegisterOrgAdminRequestSchema,
  RegisterOrgUserRequestSchema,
  RegisterRequestSchema,
} from './schemas';

export type LoginRequestType = z.infer<typeof LoginRequestSchema>;
export type RegisterRequestType = z.infer<typeof RegisterRequestSchema>;
export type RegisterOrgAdminRequestType = z.infer<
  typeof RegisterOrgAdminRequestSchema
>;
export type RegisterOrgUserRequestType = z.infer<
  typeof RegisterOrgUserRequestSchema
>;
export type ChangePasswordRequestType = z.infer<
  typeof ChangePasswordRequestSchema
>;
export type AccessTokenPayloadType = z.infer<typeof AccessTokenPayloadSchema>;
export type RefreshTokenPayloadType = z.infer<typeof RefreshTokenPayloadSchema>;

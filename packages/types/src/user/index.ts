import { z } from 'zod';

export * from './schemas';

import {
  PublicUserSchema,
  UpdateMeRequestSchema,
  UpdateUserRequestSchema,
} from './schemas';

export type PublicUserType = z.infer<typeof PublicUserSchema>;
export type UpdateUserRequestType = z.infer<typeof UpdateUserRequestSchema>;
export type UpdateMeRequestType = z.infer<typeof UpdateMeRequestSchema>;

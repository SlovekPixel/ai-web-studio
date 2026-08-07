import { z } from 'zod';

export * from './schemas';

import { LoginRequestSchema, RegisterRequestSchema } from './schemas';

export type LoginRequestType = z.infer<typeof LoginRequestSchema>;
export type RegisterRequestType = z.infer<typeof RegisterRequestSchema>;

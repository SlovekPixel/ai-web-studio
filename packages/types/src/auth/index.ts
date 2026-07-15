import type { z } from 'zod';

export * from './schemas.js';

import { AuthRequestSchema, AuthResponseSchema } from './schemas.js';

export type AuthRequestType = z.infer<typeof AuthRequestSchema>;
export type AuthResponseType = z.infer<typeof AuthResponseSchema>;

import { z } from 'zod';

export * from './schemas';

import { PublicUserSchema } from './schemas';

export type PublicUserType = z.infer<typeof PublicUserSchema>;

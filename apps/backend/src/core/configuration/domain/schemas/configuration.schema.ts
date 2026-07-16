import { z } from 'zod';

export const ConfigurationSchema = z.object({
  HOSTNAME: z.string().default('127.0.0.1'),
  BACKEND_PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export type ConfigurationType = z.infer<typeof ConfigurationSchema>;

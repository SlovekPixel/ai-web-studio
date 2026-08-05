import { z } from 'zod';

const enableSwaggerSchema = z.preprocess((value) => {
  if (value === true || value === 'true') {
    return true;
  }

  return false;
}, z.boolean());

export const ConfigurationSchema = z.object({
  BACKEND_HOSTNAME: z.string().default('127.0.0.1'),
  BACKEND_PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  ENABLE_SWAGGER: enableSwaggerSchema.default(true),
  POSTGRES_HOST: z.string().default('127.0.0.1'),
  POSTGRES_PORT: z.coerce.number().int().positive().default(5432),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
});

export type ConfigurationType = z.infer<typeof ConfigurationSchema>;

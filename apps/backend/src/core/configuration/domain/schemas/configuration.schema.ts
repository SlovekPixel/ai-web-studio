import { z } from 'zod';

const enableSwaggerSchema = z.preprocess((value) => {
  if (value === true || value === 'true') {
    return true;
  }

  return false;
}, z.boolean());

const optionalRedisPasswordSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return value;
}, z.string().min(1).optional());

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
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: optionalRedisPasswordSchema,
  REDIS_DB: z.coerce.number().int().nonnegative().default(0),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive().default(604800),
});

export type ConfigurationType = z.infer<typeof ConfigurationSchema>;

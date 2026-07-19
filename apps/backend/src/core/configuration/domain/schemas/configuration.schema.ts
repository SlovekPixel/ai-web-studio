import { z } from 'zod';

/** Matches historical semantics: everything except explicit `false` enables Swagger. */
const enableSwaggerSchema = z.preprocess((value) => {
  if (value === undefined || value === '') {
    return true;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value !== 'false';
  }

  return Boolean(value);
}, z.boolean());

export const ConfigurationSchema = z.object({
  HOSTNAME: z.string().default('127.0.0.1'),
  BACKEND_PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  ENABLE_SWAGGER: enableSwaggerSchema.default(true),
  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_NAME: z.string().default('ai_web_studio'),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  JWT_ACCESS_SECRET: z.string().min(16).default('dev-access-secret-change-me'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(16)
    .default('dev-refresh-secret-change-me'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

export type ConfigurationType = z.infer<typeof ConfigurationSchema>;

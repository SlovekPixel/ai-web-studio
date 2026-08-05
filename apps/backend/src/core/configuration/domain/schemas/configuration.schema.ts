import { z } from 'zod';

const enableSwaggerSchema = z.preprocess((value) => {
  if (value === true || value === 'true') 
    return true;
  
  return false;
}, z.boolean());

export const ConfigurationSchema = z.object({
  BACKEND_HOSTNAME: z.string().default('127.0.0.1'),
  BACKEND_PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  ENABLE_SWAGGER: enableSwaggerSchema.default(true),
});

export type ConfigurationType = z.infer<typeof ConfigurationSchema>;

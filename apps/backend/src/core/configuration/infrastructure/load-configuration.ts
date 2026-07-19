import { config as loadEnv } from 'dotenv';
import path from 'node:path';

import {
  ConfigurationSchema,
  type ConfigurationType,
} from '../domain/schemas/configuration.schema';

/** Single monorepo-root `.env`. Expects process cwd to be `apps/backend`. */
const ROOT_ENV_PATH = path.resolve(process.cwd(), '../../.env');

let cachedConfiguration: ConfigurationType | undefined;

/**
 * Loads and validates backend configuration.
 * Existing process env (e.g. Docker Compose) takes precedence over the `.env` file.
 * Safe when the file is missing — Zod defaults and injected env still apply.
 */
export function loadConfiguration(): ConfigurationType {
  if (cachedConfiguration) {
    return cachedConfiguration;
  }

  loadEnv({ path: ROOT_ENV_PATH });

  const result = ConfigurationSchema.safeParse(process.env);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');

    throw new Error(`Invalid configuration: ${details}`);
  }

  cachedConfiguration = result.data;

  return cachedConfiguration;
}

import { Inject, Injectable } from '@nestjs/common';

import type {
  DatabaseConfiguration,
  IConfigurationService,
} from '~/core/configuration/domain/ports/configuration.service.port';
import type { ConfigurationType } from '~/core/configuration/domain/schemas/configuration.schema';

export const CONFIGURATION = Symbol('CONFIGURATION');

@Injectable()
export class ConfigurationService implements IConfigurationService {
  constructor(
    @Inject(CONFIGURATION) private readonly config: ConfigurationType,
  ) {}

  get hostname(): string {
    return this.config.BACKEND_HOSTNAME;
  }

  get port(): number {
    return this.config.BACKEND_PORT;
  }

  get nodeEnv(): ConfigurationType['NODE_ENV'] {
    return this.config.NODE_ENV;
  }

  get isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  get enableSwagger(): boolean {
    return this.config.ENABLE_SWAGGER;
  }

  get database(): DatabaseConfiguration {
    return {
      host: this.config.POSTGRES_HOST,
      port: this.config.POSTGRES_PORT,
      username: this.config.POSTGRES_USER,
      password: this.config.POSTGRES_PASSWORD,
      database: this.config.POSTGRES_DB,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { ConfigurationType } from '~/core/configuration/domain/schemas/configuration.schema';

@Injectable()
export class ConfigurationService {
  constructor(
    private readonly configService: ConfigService<ConfigurationType, true>,
  ) {}

  get hostname(): string {
    return this.configService.get('HOSTNAME', { infer: true });
  }

  get port(): number {
    return this.configService.get('BACKEND_PORT', { infer: true });
  }

  get nodeEnv(): ConfigurationType['NODE_ENV'] {
    return this.configService.get('NODE_ENV', { infer: true });
  }
}

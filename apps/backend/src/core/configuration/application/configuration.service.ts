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

  get enableSwagger(): boolean {
    return this.configService.get('ENABLE_SWAGGER', { infer: true });
  }

  get dbHost(): string {
    return this.configService.get('DB_HOST', { infer: true });
  }

  get dbPort(): number {
    return this.configService.get('DB_PORT', { infer: true });
  }

  get dbName(): string {
    return this.configService.get('DB_NAME', { infer: true });
  }

  get dbUsername(): string {
    return this.configService.get('DB_USERNAME', { infer: true });
  }

  get dbPassword(): string {
    return this.configService.get('DB_PASSWORD', { infer: true });
  }

  get jwtAccessSecret(): string {
    return this.configService.get('JWT_ACCESS_SECRET', { infer: true });
  }

  get jwtRefreshSecret(): string {
    return this.configService.get('JWT_REFRESH_SECRET', { infer: true });
  }

  get jwtAccessExpiresIn(): string {
    return this.configService.get('JWT_ACCESS_EXPIRES_IN', { infer: true });
  }

  get jwtRefreshExpiresIn(): string {
    return this.configService.get('JWT_REFRESH_EXPIRES_IN', { infer: true });
  }
}

export type NodeEnv = 'development' | 'production' | 'test';

export interface DatabaseConfiguration {
  readonly host: string;
  readonly port: number;
  readonly username: string;
  readonly password: string;
  readonly database: string;
}

export interface RedisConfiguration {
  readonly host: string;
  readonly port: number;
  readonly password?: string;
  readonly db: number;
}

export interface JwtConfiguration {
  readonly accessSecret: string;
  readonly refreshSecret: string;
  readonly accessTtlSeconds: number;
  readonly refreshTtlSeconds: number;
}

export interface IConfigurationService {
  readonly hostname: string;
  readonly port: number;
  readonly nodeEnv: NodeEnv;
  readonly isProduction: boolean;
  readonly enableSwagger: boolean;
  readonly database: DatabaseConfiguration;
  readonly redis: RedisConfiguration;
  readonly jwt: JwtConfiguration;
}

export const CONFIGURATION_SERVICE = Symbol('CONFIGURATION_SERVICE');

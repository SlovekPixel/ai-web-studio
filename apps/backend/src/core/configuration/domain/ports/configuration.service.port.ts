export type NodeEnv = 'development' | 'production' | 'test';

export interface DatabaseConfiguration {
  readonly host: string;
  readonly port: number;
  readonly username: string;
  readonly password: string;
  readonly database: string;
}

export interface IConfigurationService {
  readonly hostname: string;
  readonly port: number;
  readonly nodeEnv: NodeEnv;
  readonly isProduction: boolean;
  readonly enableSwagger: boolean;
  readonly database: DatabaseConfiguration;
}

export const CONFIGURATION_SERVICE = Symbol('CONFIGURATION_SERVICE');

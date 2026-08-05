export type NodeEnv = 'development' | 'production' | 'test';

export interface IConfigurationService {
  readonly hostname: string;
  readonly port: number;
  readonly nodeEnv: NodeEnv;
  readonly isProduction: boolean;
  readonly enableSwagger: boolean;
}

export const CONFIGURATION_SERVICE = Symbol('CONFIGURATION_SERVICE');

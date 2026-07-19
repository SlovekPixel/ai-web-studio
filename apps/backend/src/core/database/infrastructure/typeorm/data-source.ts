import { DataSource } from 'typeorm';

import { loadConfiguration } from '~/core/configuration/infrastructure/load-configuration';
import { typeOrmEntities } from './entities';
import { CreateUsersTable1752800000000 } from './migrations/1752800000000-CreateUsersTable';

const configuration = loadConfiguration();

export default new DataSource({
  type: 'postgres',
  host: configuration.DB_HOST,
  port: configuration.DB_PORT,
  username: configuration.DB_USERNAME,
  password: configuration.DB_PASSWORD,
  database: configuration.DB_NAME,
  entities: typeOrmEntities,
  migrations: [CreateUsersTable1752800000000],
  synchronize: false,
  logging: configuration.NODE_ENV === 'development',
});

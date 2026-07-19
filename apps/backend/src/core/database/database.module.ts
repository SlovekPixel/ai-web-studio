import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigurationService } from '~/core/configuration/application/configuration.service';
import { typeOrmEntities } from '~/core/database/infrastructure/typeorm/entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configuration: ConfigurationService) => ({
        type: 'postgres' as const,
        host: configuration.dbHost,
        port: configuration.dbPort,
        username: configuration.dbUsername,
        password: configuration.dbPassword,
        database: configuration.dbName,
        entities: typeOrmEntities,
        synchronize: false,
        logging: configuration.nodeEnv === 'development',
      }),
    }),
  ],
})
export class DatabaseModule {}

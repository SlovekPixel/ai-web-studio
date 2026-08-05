import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CONFIGURATION_SERVICE,
  type IConfigurationService,
} from '~/core/configuration/domain/ports/configuration.service.port';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [CONFIGURATION_SERVICE],
      useFactory: (config: IConfigurationService) => ({
        type: 'postgres' as const,
        host: config.database.host,
        port: config.database.port,
        username: config.database.username,
        password: config.database.password,
        database: config.database.database,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}

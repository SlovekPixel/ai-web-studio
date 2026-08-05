import { Global, Module } from '@nestjs/common';

import {
  CONFIGURATION,
  ConfigurationService,
} from '~/core/configuration/application/configuration.service';
import { CONFIGURATION_SERVICE } from '~/core/configuration/domain/ports/configuration.service.port';
import { loadConfiguration } from '~/core/configuration/infrastructure/load-configuration';

@Global()
@Module({
  providers: [
    {
      provide: CONFIGURATION,
      useFactory: () => loadConfiguration(),
    },
    ConfigurationService,
    {
      provide: CONFIGURATION_SERVICE,
      useExisting: ConfigurationService,
    },
  ],
  exports: [CONFIGURATION_SERVICE, ConfigurationService],
})
export class ConfigurationModule {}

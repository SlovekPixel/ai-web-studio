import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConfigurationService } from '~/core/configuration/application/configuration.service';
import { ConfigurationSchema } from '~/core/configuration/domain/schemas/configuration.schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const result = ConfigurationSchema.safeParse(config);

        if (!result.success) {
          const details = result.error.issues
            .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
            .join('; ');

          throw new Error(`Invalid configuration: ${details}`);
        }

        return result.data;
      },
    }),
  ],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}

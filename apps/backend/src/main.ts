import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

import { AppModule } from '~/app.module';
import { i18nZod } from '~/config/i18n.zod';
import { SwaggerConfig } from '~/config/swagger.config';
import {
  CONFIGURATION_SERVICE,
  type IConfigurationService,
} from '~/core/configuration/domain/ports/configuration.service.port';
import { loadConfiguration } from '~/core/configuration/infrastructure/load-configuration';
import {
  LOGGER_SERVICE,
  type ILoggerService,
} from '~/core/logging/domain/ports/logger.service.port';

const GLOBAL_PREFIX = 'api';

loadConfiguration();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(GLOBAL_PREFIX);

  const logger = app.get<ILoggerService>(LOGGER_SERVICE);
  const config = app.get<IConfigurationService>(CONFIGURATION_SERVICE);
  const { hostname, port, enableSwagger, isProduction } = config;

  i18nZod();

  if (!isProduction || enableSwagger) {
    const document = cleanupOpenApiDoc(
      SwaggerModule.createDocument(app, SwaggerConfig),
    );

    SwaggerModule.setup('docs', app, document, {
      useGlobalPrefix: true,
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
      },
    });

    logger.log(
      `Swagger documentation is available at http://${hostname}:${port}/${GLOBAL_PREFIX}/docs`,
      'Bootstrap',
    );
  }

  await app.listen(port, hostname);

  logger.log(
    `Application started at http://${hostname}:${port}/${GLOBAL_PREFIX}`,
    'Bootstrap',
  );
}

void bootstrap();

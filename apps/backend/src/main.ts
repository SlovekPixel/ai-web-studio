import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

import { AppModule } from '~/app.module';
import { i18nZod } from '~/config/i18n.zod';
import { SwaggerConfig } from '~/config/swaggger.config';
import { ConfigurationService } from '~/core/configuration/application/configuration.service';
import { LoggerService } from '~/core/logging/application/logger.service';

const GLOBAL_PREFIX = 'api';

export const viteNodeApp = NestFactory.create(AppModule);

async function bootstrap(): Promise<void> {
  const app = await viteNodeApp;

  app.setGlobalPrefix(GLOBAL_PREFIX);

  const configuration = app.get(ConfigurationService);
  const logger = app.get(LoggerService);
  const { hostname, port, nodeEnv, enableSwagger } = configuration;
  const isProduction = nodeEnv === 'production';

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

  if (isProduction) {
    await app.listen(port, hostname);

    logger.log(
      `Application started (v${AI_WEB_STUDIO_VERSION}) at http://${hostname}:${port}/${GLOBAL_PREFIX}`,
      'Bootstrap',
    );
  }

  if (!isProduction) {
    logger.warn(
      `Application started at http://${hostname}:${port}/${GLOBAL_PREFIX}`,
      'Bootstrap',
    );
  }
}

bootstrap();

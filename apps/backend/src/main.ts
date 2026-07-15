import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

import { AppModule } from '~/app.module';
import { ConfigurationService } from '~/core/configuration/application/configuration.service';
import { i18nZod } from '~/config/i18n.zod';
import { SwaggerConfig } from '~/config/swaggger.config';

const GLOBAL_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(GLOBAL_PREFIX);

  i18nZod

  const configuration = app.get(ConfigurationService);

  const PORT = configuration.port;
  const HOSTNAME = configuration.hostname;

  const document = cleanupOpenApiDoc(
    SwaggerModule.createDocument(app, SwaggerConfig),
  );
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
  });

  await app.listen(PORT, HOSTNAME);
}

void bootstrap();

import { DocumentBuilder } from '@nestjs/swagger';

import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from '~/core/i18n/domain/constants/locales';

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('AI Web Studio API')
  .setDescription('API documentation')
  .setVersion('1.0.0')
  .addApiKey(
    {
      type: 'apiKey',
      name: 'Accept-Language',
      in: 'header',
      description: `Preferred response language (${SUPPORTED_LOCALES.join(', ')}). Default: ${DEFAULT_LOCALE}`,
    },
    'Accept-Language',
  )
  .addSecurityRequirements('Accept-Language')
  .build();

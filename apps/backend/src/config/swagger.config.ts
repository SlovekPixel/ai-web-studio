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
  .addCookieAuth('access_token', {
    type: 'apiKey',
    in: 'cookie',
    name: 'access_token',
    description: 'JWT access token httpOnly cookie',
  })
  .addCookieAuth('refresh_token', {
    type: 'apiKey',
    in: 'cookie',
    name: 'refresh_token',
    description: 'JWT refresh token httpOnly cookie',
  })
  .addSecurityRequirements('Accept-Language')
  .build();

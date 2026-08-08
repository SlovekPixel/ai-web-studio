import { applyDecorators } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation } from '@nestjs/swagger';

import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function LogoutSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Выйти из текущей сессии',
      description:
        'Инвалидирует текущую refresh-сессию, добавляет access jti в blacklist и очищает auth cookies.',
    }),
    ApiNoContentResponse({
      description: 'Выход выполнен, cookies очищены',
    }),
    DefaultApiResponses(),
  );
}

import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function RefreshSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Обновить токены',
      description:
        'Ротирует refresh-сессию по cookie refresh_token и выставляет новую пару httpOnly cookies.',
    }),
    ApiNoContentResponse({
      description: 'Токены обновлены, cookies установлены',
    }),
    ApiUnauthorizedResponse({
      description: 'Refresh-токен отсутствует или недействителен',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

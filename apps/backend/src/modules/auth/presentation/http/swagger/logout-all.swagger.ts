import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function LogoutAllSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Выйти из всех сессий',
      description:
        'Инвалидирует все refresh-сессии пользователя, выставляет revokeBefore и очищает auth cookies.',
    }),
    ApiNoContentResponse({
      description: 'Все сессии завершены, cookies очищены',
    }),
    ApiUnauthorizedResponse({
      description: 'Нет валидных auth cookies для идентификации пользователя',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

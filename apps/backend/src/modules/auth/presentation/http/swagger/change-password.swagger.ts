import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function ChangePasswordSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Сменить пароль',
      description:
        'Проверяет текущий пароль авторизованного пользователя и устанавливает новый.',
    }),
    ApiNoContentResponse({
      description: 'Пароль успешно изменён',
    }),
    ApiBadRequestResponse({
      description: 'Некорректные данные запроса или пароли не совпадают',
      type: ExceptionResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Не авторизован или неверный текущий пароль',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

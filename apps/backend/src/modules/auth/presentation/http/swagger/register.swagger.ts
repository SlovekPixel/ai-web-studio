import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function RegisterSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Зарегистрировать пользователя',
      description:
        'Создаёт нового пользователя и выставляет httpOnly cookies access_token и refresh_token.',
    }),
    ApiCreatedResponse({
      description: 'Пользователь успешно зарегистрирован, cookies установлены',
    }),
    ApiBadRequestResponse({
      description: 'Некорректные данные запроса',
      type: ExceptionResponseDto,
    }),
    ApiConflictResponse({
      description: 'Пользователь с таким логином уже существует',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

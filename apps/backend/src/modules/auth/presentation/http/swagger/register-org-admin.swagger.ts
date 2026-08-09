import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiGoneResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function RegisterOrgAdminSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Зарегистрировать владельца организации по приглашению',
      description:
        'Создаёт пользователя и организацию по одноразовому токену приглашения, назначает пользователя владельцем и выставляет auth cookies.',
    }),
    ApiCreatedResponse({
      description: 'Пользователь и организация созданы, cookies установлены',
    }),
    ApiBadRequestResponse({
      description: 'Некорректные данные запроса',
      type: ExceptionResponseDto,
    }),
    ApiGoneResponse({
      description: 'Приглашение недействительно или истекло',
      type: ExceptionResponseDto,
    }),
    ApiConflictResponse({
      description: 'Конфликт логина, названия организации или ИНН',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

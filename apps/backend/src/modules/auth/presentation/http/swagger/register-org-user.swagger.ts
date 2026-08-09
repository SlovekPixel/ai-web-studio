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

export function RegisterOrgUserSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Зарегистрировать участника организации по приглашению',
      description:
        'Создаёт пользователя и привязывает его к организации по одноразовому member-invite токену, выставляет auth cookies.',
    }),
    ApiCreatedResponse({
      description:
        'Пользователь создан и привязан к организации, cookies установлены',
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
      description: 'Пользователь с таким логином уже существует',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

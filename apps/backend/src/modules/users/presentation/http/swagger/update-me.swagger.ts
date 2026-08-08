import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function UpdateMeSwagger(): MethodDecorator {
  return applyDecorators(
    ApiCookieAuth('access_token'),
    ApiOperation({
      summary: 'Обновить профиль текущего пользователя',
      description:
        'Позволяет изменить ФИО. Email можно установить один раз, если он ещё не задан.',
    }),
    ApiOkResponse({
      description: 'Профиль успешно обновлён',
      type: UserResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Некорректные данные или email уже установлен',
      type: ExceptionResponseDto,
    }),
    ApiConflictResponse({
      description: 'Email уже занят',
      type: ExceptionResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Пользователь не найден',
      type: ExceptionResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Недостаточно прав',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses({ path: '/api/users/me' }),
  );
}

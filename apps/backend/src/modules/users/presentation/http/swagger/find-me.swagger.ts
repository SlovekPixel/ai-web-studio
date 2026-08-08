import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function FindMeSwagger(): MethodDecorator {
  return applyDecorators(
    ApiCookieAuth('access_token'),
    ApiOperation({
      summary: 'Получить текущего пользователя',
      description:
        'Возвращает данные пользователя из access-токена текущей сессии.',
    }),
    ApiOkResponse({
      description: 'Текущий пользователь',
      type: UserResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Недостаточно прав',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses({ path: '/api/users/me' }),
  );
}

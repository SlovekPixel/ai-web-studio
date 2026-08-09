import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function FindMembersSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить участников текущей организации',
      description:
        'Возвращает список пользователей, привязанных к организации текущего пользователя.',
    }),
    ApiOkResponse({
      description: 'Список участников успешно получен',
      type: [UserResponseDto],
    }),
    ApiForbiddenResponse({
      description: 'Пользователь не состоит в организации',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function FindAllSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить список пользователей',
      description: 'Возвращает полный список пользователей в системе.',
    }),
    ApiOkResponse({
      description: 'Список пользователей успешно получен',
      type: [UserResponseDto],
    }),
    DefaultApiResponses(),
  );
}

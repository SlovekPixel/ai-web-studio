import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function FindByIdSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить пользователя по ID',
      description: 'Возвращает пользователя по его уникальному идентификатору.',
    }),
    ApiOkResponse({
      description: 'Пользователь успешно найден',
      type: UserResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Некорректный формат UUID',
      type: ExceptionResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Пользователь не найден',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

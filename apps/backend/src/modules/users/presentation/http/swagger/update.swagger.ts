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

export function UpdateSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Обновить пользователя',
      description: 'Обновляет статус активности пользователя по ID.',
    }),
    ApiOkResponse({
      description: 'Пользователь успешно обновлён',
      type: UserResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Некорректный UUID или данные запроса',
      type: ExceptionResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Пользователь не найден',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

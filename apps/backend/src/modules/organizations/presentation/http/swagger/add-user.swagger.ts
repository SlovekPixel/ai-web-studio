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

export function AddUserSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Добавить пользователя в организацию',
      description:
        'Привязывает существующего пользователя к организации по UUID.',
    }),
    ApiOkResponse({
      description: 'Пользователь успешно добавлен в организацию',
      type: UserResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Некорректный UUID или данные запроса',
      type: ExceptionResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Организация или пользователь не найдены',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function LoginSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Войти в систему',
      description: 'Аутентифицирует пользователя по логину и паролю.',
    }),
    ApiOkResponse({
      description: 'Вход выполнен успешно',
      type: UserResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Некорректные данные запроса',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

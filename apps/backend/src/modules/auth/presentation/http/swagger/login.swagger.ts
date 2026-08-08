import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function LoginSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Войти в систему',
      description:
        'Аутентифицирует пользователя по логину и паролю и выставляет httpOnly cookies access_token и refresh_token.',
    }),
    ApiNoContentResponse({
      description: 'Вход выполнен успешно, cookies установлены',
    }),
    ApiBadRequestResponse({
      description: 'Некорректные данные запроса',
      type: ExceptionResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Неверный логин или пароль',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function DeactivateMemberSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Деактивировать участника организации',
      description:
        'Только владелец организации. Устанавливает участнику active=false. Реактивация через этот эндпоинт невозможна. Владельца организации деактивировать нельзя.',
    }),
    ApiParam({
      name: 'userId',
      description: 'UUID участника организации',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Участник деактивирован',
      type: UserResponseDto,
    }),
    ApiForbiddenResponse({
      description:
        'Недостаточно прав, попытка деактивировать себя или владельца',
      type: ExceptionResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Участник не найден в организации',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

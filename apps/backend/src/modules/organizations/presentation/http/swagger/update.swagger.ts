import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { OrganizationResponseDto } from '~/modules/organizations/presentation/http/dto/organization-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function UpdateSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Обновить организацию',
      description: 'Обновляет данные существующей организации по UUID.',
    }),
    ApiOkResponse({
      description: 'Организация успешно обновлена',
      type: OrganizationResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Некорректный UUID или данные запроса',
      type: ExceptionResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Организация не найдена',
      type: ExceptionResponseDto,
    }),
    ApiConflictResponse({
      description: 'Организация с таким именем уже существует',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

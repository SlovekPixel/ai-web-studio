import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { OrganizationResponseDto } from '~/modules/organizations/presentation/http/dto/organization-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function FindByUuidSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить организацию по UUID',
      description: 'Возвращает организацию по её уникальному идентификатору.',
    }),
    ApiOkResponse({
      description: 'Организация успешно найдена',
      type: OrganizationResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Некорректный формат UUID',
      type: ExceptionResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Организация не найдена',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

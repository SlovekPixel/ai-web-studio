import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { OrganizationResponseDto } from '~/modules/organizations/presentation/http/dto/organization-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function FindAllSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить список организаций',
      description: 'Возвращает полный список организаций в системе.',
    }),
    ApiOkResponse({
      description: 'Список организаций успешно получен',
      type: [OrganizationResponseDto],
    }),
    DefaultApiResponses(),
  );
}

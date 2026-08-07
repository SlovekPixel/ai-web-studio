import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { OrganizationResponseDto } from '~/modules/organizations/presentation/http/dto/organization-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function CreateSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Создать организацию',
      description: 'Создаёт новую организацию и назначает ей владельца.',
    }),
    ApiCreatedResponse({
      description: 'Организация успешно создана',
      type: OrganizationResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Некорректные данные запроса',
      type: ExceptionResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Владелец организации не найден',
      type: ExceptionResponseDto,
    }),
    ApiConflictResponse({
      description: 'Организация с таким именем или ИНН уже существует',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

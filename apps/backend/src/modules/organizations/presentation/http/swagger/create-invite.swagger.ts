import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { OrganizationInviteResponseDto } from '~/modules/organizations/presentation/http/dto/organization-invite-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function CreateInviteSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Создать приглашение для регистрации владельца организации',
      description:
        'Генерирует одноразовую ссылку на 2 минуты для регистрации владельца новой организации.',
    }),
    ApiCreatedResponse({
      description: 'Приглашение успешно создано',
      type: OrganizationInviteResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Некорректные данные запроса',
      type: ExceptionResponseDto,
    }),
    ApiConflictResponse({
      description: 'Организация с таким именем уже существует',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

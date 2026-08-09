import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { OrganizationMemberInviteResponseDto } from '~/modules/organizations/presentation/http/dto/organization-member-invite-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function CreateMemberInviteSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Создать приглашение участника организации',
      description:
        'Доступно только владельцу организации. Генерирует одноразовую ссылку на 2 минуты; предыдущая активная ссылка инвалидируется.',
    }),
    ApiCreatedResponse({
      description: 'Приглашение успешно создано',
      type: OrganizationMemberInviteResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Пользователь не является владельцем организации',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

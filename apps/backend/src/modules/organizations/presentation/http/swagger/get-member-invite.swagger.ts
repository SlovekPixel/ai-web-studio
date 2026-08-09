import { applyDecorators } from '@nestjs/common';
import { ApiGoneResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { OrganizationMemberInvitePreviewDto } from '~/modules/organizations/presentation/http/dto/organization-member-invite-preview.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function GetMemberInviteSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить данные приглашения участника',
      description:
        'Возвращает название организации по токену member-invite, если ссылка ещё действительна.',
    }),
    ApiOkResponse({
      description: 'Приглашение найдено',
      type: OrganizationMemberInvitePreviewDto,
    }),
    ApiGoneResponse({
      description: 'Приглашение недействительно или истекло',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

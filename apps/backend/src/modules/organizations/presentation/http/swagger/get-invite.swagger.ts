import { applyDecorators } from '@nestjs/common';
import { ApiGoneResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { OrganizationInvitePreviewDto } from '~/modules/organizations/presentation/http/dto/organization-invite-preview.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function GetInviteSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить данные приглашения организации',
      description:
        'Возвращает название организации по токену приглашения, если ссылка ещё действительна.',
    }),
    ApiOkResponse({
      description: 'Приглашение найдено',
      type: OrganizationInvitePreviewDto,
    }),
    ApiGoneResponse({
      description: 'Приглашение недействительно или истекло',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses(),
  );
}

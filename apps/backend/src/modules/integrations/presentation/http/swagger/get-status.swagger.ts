import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { ComfyUiIntegrationStatusResponseDto } from '~/modules/integrations/presentation/http/dto/comfyui-integration-status-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function GetStatusSwagger(): MethodDecorator {
  return applyDecorators(
    ApiCookieAuth('access_token'),
    ApiOperation({
      summary: 'Статус интеграции ComfyUI',
      description:
        'Возвращает, подключена ли интеграция ComfyUI для организации текущего пользователя. Токен не возвращается.',
    }),
    ApiOkResponse({
      description: 'Статус интеграции ComfyUI',
      type: ComfyUiIntegrationStatusResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Пользователь не привязан к организации',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses({ path: '/api/integrations/comfyui-integration' }),
  );
}

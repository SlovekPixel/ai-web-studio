import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { ComfyUiIntegrationStatusResponseDto } from '~/modules/integrations/presentation/http/dto/comfyui-integration-status-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function DeleteIntegrationSwagger(): MethodDecorator {
  return applyDecorators(
    ApiCookieAuth('access_token'),
    ApiOperation({
      summary: 'Удалить интеграцию ComfyUI',
      description:
        'Удаляет токен ComfyUI организации. Доступно только владельцу. Идемпотентно, если интеграция уже отсутствует.',
    }),
    ApiOkResponse({
      description: 'Интеграция ComfyUI удалена',
      type: ComfyUiIntegrationStatusResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Только владелец организации может управлять интеграцией',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses({ path: '/api/integrations/comfyui-integration' }),
  );
}

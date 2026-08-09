import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { ComfyUiIntegrationResponseDto } from '~/modules/integrations/presentation/http/dto/comfyui-integration-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function GetTokenSwagger(): MethodDecorator {
  return applyDecorators(
    ApiCookieAuth('access_token'),
    ApiOperation({
      summary: 'Получить токен ComfyUI',
      description:
        'Возвращает токен ComfyUI для организации текущего пользователя.',
    }),
    ApiOkResponse({
      description: 'Токен ComfyUI успешно получен',
      type: ComfyUiIntegrationResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Пользователь не привязан к организации',
      type: ExceptionResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Токен ComfyUI не настроен',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses({ path: '/api/integrations/comfyui-integration' }),
  );
}

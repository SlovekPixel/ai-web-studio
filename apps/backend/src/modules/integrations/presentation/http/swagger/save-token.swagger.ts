import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';
import { ComfyUiIntegrationResponseDto } from '~/modules/integrations/presentation/http/dto/comfyui-integration-response.dto';
import { DefaultApiResponses } from '~/swagger/default-api-responses';

export function SaveTokenSwagger(): MethodDecorator {
  return applyDecorators(
    ApiCookieAuth('access_token'),
    ApiOperation({
      summary: 'Сохранить токен ComfyUI',
      description:
        'Создаёт или обновляет токен ComfyUI для организации текущего пользователя.',
    }),
    ApiOkResponse({
      description: 'Токен ComfyUI успешно сохранён',
      type: ComfyUiIntegrationResponseDto,
    }),
    ApiBadRequestResponse({
      description:
        'Некорректные данные запроса или пользователь не привязан к организации',
      type: ExceptionResponseDto,
    }),
    DefaultApiResponses({ path: '/api/integrations/comfyui-integration' }),
  );
}

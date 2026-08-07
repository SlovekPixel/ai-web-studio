import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ExceptionResponseDto } from '~/filters/dto/exception-response.dto';

type DefaultApiResponsesOptions = {
  path?: string;
};

export function DefaultApiResponses(
  options: DefaultApiResponsesOptions = {},
): MethodDecorator {
  const path = options.path ?? '/api';

  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: ExceptionResponseDto,
      example: {
        summary: 'Missing or invalid credentials',
        value: {
          statusCode: HttpStatus.UNAUTHORIZED,
          path,
          message: 'Unauthorized',
          timestamp: '2026-01-01T00:00:00.000Z',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ExceptionResponseDto,
      example: {
        summary: 'Unexpected API failure',
        value: {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          path,
          message: 'API server error',
          timestamp: '2026-01-01T00:00:00.000Z',
        },
      },
    }),
  );
}

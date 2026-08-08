import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import type { PublicUserType } from '@repo/types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): PublicUserType => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.user as PublicUserType;
  },
);

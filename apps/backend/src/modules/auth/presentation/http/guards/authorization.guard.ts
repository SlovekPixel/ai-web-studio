import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef, Reflector } from '@nestjs/core';
import type { Request } from 'express';

import type { PublicUserType } from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  IS_ADMIN_KEY,
  IS_PUBLIC_KEY,
} from '~/modules/auth/presentation/http/decorators/auth.constants';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isAdmin) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as PublicUserType | undefined;
    const i18nService = await this.resolveI18n(request);

    if (!user) {
      throw new UnauthorizedException(
        i18nService.translate('ERRORS.UNAUTHORIZED'),
      );
    }

    if (!user.isAdmin) {
      throw new ForbiddenException(i18nService.translate('ERRORS.FORBIDDEN'));
    }

    return true;
  }

  private async resolveI18n(request: Request): Promise<II18nService> {
    const contextId = ContextIdFactory.getByRequest(request);
    return this.moduleRef.resolve<II18nService>(I18N_SERVICE, contextId, {
      strict: false,
    });
  }
}

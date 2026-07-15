import { Injectable } from '@nestjs/common';
import type { AuthRequestType, AuthResponseType } from '@repo/types';

import { LoggerService } from '~/core/logging/application/logger.service';
import type { IAuthService } from '~/modules/auth/domain/ports/auth.service.port';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly logger: LoggerService) {}

  login(credentials: AuthRequestType): AuthResponseType {
    this.logger.log(
      `Login attempt for user "${credentials.username}"`,
      AuthService.name,
    );

    return {
      accessToken: `token-for-${credentials.username}`,
    };
  }
}

import { Injectable } from '@nestjs/common';
import type { AuthRequestType, AuthResponseType } from '@repo/types';

import type { IAuthService } from '~/modules/auth/domain/ports/auth.service.port';

@Injectable()
export class AuthService implements IAuthService {
  login(credentials: AuthRequestType): AuthResponseType {
    return {
      accessToken: `token-for-${credentials.username}`,
    };
  }
}

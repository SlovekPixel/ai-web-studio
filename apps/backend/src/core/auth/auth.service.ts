import { Injectable } from '@nestjs/common';
import type { AuthResponse, LoginCredentials } from '@repo/types';

@Injectable()
export class AuthService {
  login(credentials: LoginCredentials): AuthResponse {
    return {
      accessToken: `token-for-${credentials.username}`,
    };
  }
}

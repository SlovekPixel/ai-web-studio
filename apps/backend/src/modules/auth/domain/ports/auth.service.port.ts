import type { AuthRequestType, AuthResponseType } from '@repo/types';

export interface IAuthService {
  login(credentials: AuthRequestType): AuthResponseType;
}

export const AUTH_SERVICE = Symbol('AUTH_SERVICE');

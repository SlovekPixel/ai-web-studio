import type {
  AuthRequestType,
  AuthResponseType,
  RefreshRequestType,
  RegisterRequestType,
} from '@repo/types';

export interface IAuthService {
  register(payload: RegisterRequestType): Promise<AuthResponseType>;
  login(credentials: AuthRequestType): Promise<AuthResponseType>;
  refresh(payload: RefreshRequestType): Promise<AuthResponseType>;
}

export const AUTH_SERVICE = Symbol('AUTH_SERVICE');

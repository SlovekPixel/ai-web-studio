import type {
  AuthRequestType,
  AuthResponseType,
  RefreshRequestType,
  RegisterRequestType,
} from '@repo/types';

import { apiRequest } from '~/shared/api/client';

export function register(
  payload: RegisterRequestType,
): Promise<AuthResponseType> {
  return apiRequest<AuthResponseType>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function login(credentials: AuthRequestType): Promise<AuthResponseType> {
  return apiRequest<AuthResponseType>('/auth/login', {
    method: 'POST',
    body: credentials,
  });
}

export function refresh(
  payload: RefreshRequestType,
): Promise<AuthResponseType> {
  return apiRequest<AuthResponseType>('/auth/refresh', {
    method: 'POST',
    body: payload,
  });
}

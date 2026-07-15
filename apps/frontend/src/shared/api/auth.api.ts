import type { AuthRequestType, AuthResponseType } from '@repo/types';

import { apiRequest } from '~/shared/api/client';

export function login(credentials: AuthRequestType): Promise<AuthResponseType> {
  return apiRequest<AuthResponseType>('/auth/login', {
    method: 'POST',
    body: credentials,
  });
}

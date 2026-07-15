import type { AuthResponse, LoginCredentials } from '@repo/types';

import { apiRequest } from '~/shared/api/client';

export function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
  });
}

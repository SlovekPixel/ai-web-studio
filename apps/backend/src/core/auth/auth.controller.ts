import { Body, Controller, Post } from '@nestjs/common';
import type { AuthResponse, LoginCredentials } from '@repo/types';

import { AuthService } from '~/core/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() credentials: LoginCredentials): AuthResponse {
    return this.authService.login(credentials);
  }
}

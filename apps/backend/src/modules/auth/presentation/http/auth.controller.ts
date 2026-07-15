import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { AuthService } from '~/modules/auth/application/auth.service';
import { AuthRequestDto } from '~/modules/auth/presentation/http/dto/auth-request.dto';
import { AuthResponseDto } from '~/modules/auth/presentation/http/dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ZodResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  login(@Body() credentials: AuthRequestDto) {
    return this.authService.login(credentials);
  }
}

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { AuthService } from '~/modules/auth/application/auth.service';
import { AuthRequestDto } from '~/modules/auth/presentation/http/dto/auth-request.dto';
import { AuthResponseDto } from '~/modules/auth/presentation/http/dto/auth-response.dto';
import { RefreshRequestDto } from '~/modules/auth/presentation/http/dto/refresh-request.dto';
import { RegisterRequestDto } from '~/modules/auth/presentation/http/dto/register-request.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ZodResponse({
    status: 201,
    description: 'Registration successful',
    type: AuthResponseDto,
  })
  register(@Body() payload: RegisterRequestDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  @ZodResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  login(@Body() credentials: AuthRequestDto) {
    return this.authService.login(credentials);
  }

  @Post('refresh')
  @ZodResponse({
    status: 200,
    description: 'Tokens refreshed',
    type: AuthResponseDto,
  })
  refresh(@Body() payload: RefreshRequestDto) {
    return this.authService.refresh(payload);
  }
}

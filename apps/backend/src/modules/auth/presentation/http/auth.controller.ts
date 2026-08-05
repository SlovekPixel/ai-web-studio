import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from '~/modules/auth/application/auth.service';
import { LoginRequestDto } from '~/modules/auth/presentation/http/dto/login-request.dto';
import { RegisterRequestDto } from '~/modules/auth/presentation/http/dto/register-request.dto';
import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ type: UserResponseDto })
  register(@Body() body: RegisterRequestDto): Promise<UserResponseDto> {
    return this.authService.register(body.login, body.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with login and password' })
  @ApiOkResponse({ type: UserResponseDto })
  login(@Body() body: LoginRequestDto): Promise<UserResponseDto> {
    return this.authService.login(body.login, body.password);
  }
}

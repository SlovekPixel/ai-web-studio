import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from '~/modules/auth/application/auth.service';
import { LoginRequestDto } from '~/modules/auth/presentation/http/dto/login-request.dto';
import { RegisterRequestDto } from '~/modules/auth/presentation/http/dto/register-request.dto';
import { LoginSwagger } from '~/modules/auth/presentation/http/swagger/login.swagger';
import { RegisterSwagger } from '~/modules/auth/presentation/http/swagger/register.swagger';
import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @RegisterSwagger()
  register(@Body() body: RegisterRequestDto): Promise<UserResponseDto> {
    return this.authService.register(body.login, body.password, body.fullName);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginSwagger()
  login(@Body() body: LoginRequestDto): Promise<UserResponseDto> {
    return this.authService.login(body.login, body.password);
  }
}

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LoginUseCase } from '~/modules/auth/application/use-cases/login.use-case';
import { RegisterUseCase } from '~/modules/auth/application/use-cases/register.use-case';
import { LoginRequestDto } from '~/modules/auth/presentation/http/dto/login-request.dto';
import { RegisterRequestDto } from '~/modules/auth/presentation/http/dto/register-request.dto';
import { LoginSwagger } from '~/modules/auth/presentation/http/swagger/login.swagger';
import { RegisterSwagger } from '~/modules/auth/presentation/http/swagger/register.swagger';
import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @RegisterSwagger()
  register(@Body() body: RegisterRequestDto): Promise<UserResponseDto> {
    return this.registerUseCase.execute(
      body.login,
      body.password,
      body.fullName,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginSwagger()
  login(@Body() body: LoginRequestDto): Promise<UserResponseDto> {
    return this.loginUseCase.execute(body.login, body.password);
  }
}

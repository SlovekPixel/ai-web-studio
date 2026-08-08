import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { PublicUserType } from '@repo/types';

import {
  LOGGER_SERVICE,
  type ILoggerService,
} from '~/core/logging/domain/ports/logger.service.port';
import { CurrentUser } from '~/modules/auth/presentation/http/decorators/current-user.decorator';
import { IsAdmin } from '~/modules/auth/presentation/http/decorators/is-admin.decorator';
import { IsUser } from '~/modules/auth/presentation/http/decorators/is-user.decorator';
import { FindAllUsersUseCase } from '~/modules/users/application/use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from '~/modules/users/application/use-cases/find-user-by-id.use-case';
import { UpdateMeUseCase } from '~/modules/users/application/use-cases/update-me.use-case';
import { UpdateUserUseCase } from '~/modules/users/application/use-cases/update-user.use-case';
import { UpdateMeRequestDto } from '~/modules/users/presentation/http/dto/update-me-request.dto';
import { UpdateUserRequestDto } from '~/modules/users/presentation/http/dto/update-user-request.dto';
import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';
import { FindAllSwagger } from '~/modules/users/presentation/http/swagger/find-all.swagger';
import { FindByIdSwagger } from '~/modules/users/presentation/http/swagger/find-by-id.swagger';
import { FindMeSwagger } from '~/modules/users/presentation/http/swagger/find-me.swagger';
import { UpdateMeSwagger } from '~/modules/users/presentation/http/swagger/update-me.swagger';
import { UpdateSwagger } from '~/modules/users/presentation/http/swagger/update.swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updateMeUseCase: UpdateMeUseCase,
    @Inject(LOGGER_SERVICE)
    private readonly logger: ILoggerService,
  ) {}

  @Get('me')
  @IsUser()
  @FindMeSwagger()
  me(@CurrentUser() user: PublicUserType): UserResponseDto {
    this.logger.log(
      `Current user requested /users/me: ${user.id}`,
      UsersController.name,
    );
    return user;
  }

  @Patch('me')
  @IsUser()
  @UpdateMeSwagger()
  updateMe(
    @CurrentUser() user: PublicUserType,
    @Body() body: UpdateMeRequestDto,
  ): Promise<UserResponseDto> {
    return this.updateMeUseCase.execute(user.id, body);
  }

  @Get()
  @IsAdmin()
  @FindAllSwagger()
  findAll(): Promise<UserResponseDto[]> {
    return this.findAllUsersUseCase.execute();
  }

  @Get(':id')
  @IsAdmin()
  @FindByIdSwagger()
  findById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserResponseDto> {
    return this.findUserByIdUseCase.execute(id);
  }

  @Patch(':id')
  @IsAdmin()
  @UpdateSwagger()
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return this.updateUserUseCase.execute(id, body);
  }
}

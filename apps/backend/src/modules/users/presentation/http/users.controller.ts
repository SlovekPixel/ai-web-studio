import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindAllUsersUseCase } from '~/modules/users/application/use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from '~/modules/users/application/use-cases/find-user-by-id.use-case';
import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';
import { FindAllSwagger } from '~/modules/users/presentation/http/swagger/find-all.swagger';
import { FindByIdSwagger } from '~/modules/users/presentation/http/swagger/find-by-id.swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  @Get()
  @FindAllSwagger()
  findAll(): Promise<UserResponseDto[]> {
    return this.findAllUsersUseCase.execute();
  }

  @Get(':id')
  @FindByIdSwagger()
  findById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserResponseDto> {
    return this.findUserByIdUseCase.execute(id);
  }
}

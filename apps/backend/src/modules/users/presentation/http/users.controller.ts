import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from '~/modules/users/application/user.service';
import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';
import { FindAllSwagger } from '~/modules/users/presentation/http/swagger/find-all.swagger';
import { FindByIdSwagger } from '~/modules/users/presentation/http/swagger/find-by-id.swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @FindAllSwagger()
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @FindByIdSwagger()
  findById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }
}

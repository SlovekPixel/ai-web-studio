import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserService } from '~/modules/users/application/user.service';
import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: [UserResponseDto] })
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get user by uuid' })
  @ApiOkResponse({ type: UserResponseDto })
  findByUuid(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ): Promise<UserResponseDto> {
    return this.userService.findByUuid(uuid);
  }
}

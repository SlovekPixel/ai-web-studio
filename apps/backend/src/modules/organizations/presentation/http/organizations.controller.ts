import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IsAdmin } from '~/modules/auth/presentation/http/decorators/is-admin.decorator';
import { AddUserToOrganizationUseCase } from '~/modules/organizations/application/use-cases/add-user-to-organization.use-case';
import { CreateOrganizationUseCase } from '~/modules/organizations/application/use-cases/create-organization.use-case';
import { FindAllOrganizationsUseCase } from '~/modules/organizations/application/use-cases/find-all-organizations.use-case';
import { FindOrganizationByUuidUseCase } from '~/modules/organizations/application/use-cases/find-organization-by-uuid.use-case';
import { UpdateOrganizationUseCase } from '~/modules/organizations/application/use-cases/update-organization.use-case';
import { AddOrganizationUserRequestDto } from '~/modules/organizations/presentation/http/dto/add-organization-user-request.dto';
import { CreateOrganizationRequestDto } from '~/modules/organizations/presentation/http/dto/create-organization-request.dto';
import { OrganizationResponseDto } from '~/modules/organizations/presentation/http/dto/organization-response.dto';
import { UpdateOrganizationRequestDto } from '~/modules/organizations/presentation/http/dto/update-organization-request.dto';
import { AddUserSwagger } from '~/modules/organizations/presentation/http/swagger/add-user.swagger';
import { CreateSwagger } from '~/modules/organizations/presentation/http/swagger/create.swagger';
import { FindAllSwagger } from '~/modules/organizations/presentation/http/swagger/find-all.swagger';
import { FindByUuidSwagger } from '~/modules/organizations/presentation/http/swagger/find-by-uuid.swagger';
import { UpdateSwagger } from '~/modules/organizations/presentation/http/swagger/update.swagger';
import { UserResponseDto } from '~/modules/users/presentation/http/dto/user-response.dto';

@ApiTags('organizations')
@IsAdmin()
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly findAllOrganizationsUseCase: FindAllOrganizationsUseCase,
    private readonly findOrganizationByUuidUseCase: FindOrganizationByUuidUseCase,
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
    private readonly addUserToOrganizationUseCase: AddUserToOrganizationUseCase,
  ) {}

  @Get()
  @FindAllSwagger()
  findAll(): Promise<OrganizationResponseDto[]> {
    return this.findAllOrganizationsUseCase.execute();
  }

  @Get(':uuid')
  @FindByUuidSwagger()
  findByUuid(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ): Promise<OrganizationResponseDto> {
    return this.findOrganizationByUuidUseCase.execute(uuid);
  }

  @Post()
  @CreateSwagger()
  create(
    @Body() body: CreateOrganizationRequestDto,
  ): Promise<OrganizationResponseDto> {
    return this.createOrganizationUseCase.execute({
      name: body.name,
      description: body.description ?? null,
      inn: body.inn ?? null,
      ownerId: body.ownerId,
    });
  }

  @Patch(':uuid')
  @UpdateSwagger()
  update(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
    @Body() body: UpdateOrganizationRequestDto,
  ): Promise<OrganizationResponseDto> {
    return this.updateOrganizationUseCase.execute(uuid, {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.description !== undefined
        ? { description: body.description }
        : {}),
    });
  }

  @Post(':uuid/users')
  @AddUserSwagger()
  addUser(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
    @Body() body: AddOrganizationUserRequestDto,
  ): Promise<UserResponseDto> {
    return this.addUserToOrganizationUseCase.execute(uuid, body.userId);
  }
}

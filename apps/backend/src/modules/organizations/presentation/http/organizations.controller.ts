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

import { OrganizationService } from '~/modules/organizations/application/organization.service';
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
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @FindAllSwagger()
  findAll(): Promise<OrganizationResponseDto[]> {
    return this.organizationService.findAll();
  }

  @Get(':uuid')
  @FindByUuidSwagger()
  findByUuid(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ): Promise<OrganizationResponseDto> {
    return this.organizationService.findByUuid(uuid);
  }

  @Post()
  @CreateSwagger()
  create(
    @Body() body: CreateOrganizationRequestDto,
  ): Promise<OrganizationResponseDto> {
    return this.organizationService.create({
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
    return this.organizationService.update(uuid, {
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
    return this.organizationService.addUser(uuid, body.userId);
  }
}

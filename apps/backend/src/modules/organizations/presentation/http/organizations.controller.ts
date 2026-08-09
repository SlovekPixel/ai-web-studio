import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IsAdmin } from '~/modules/auth/presentation/http/decorators/is-admin.decorator';
import { IsPublic } from '~/modules/auth/presentation/http/decorators/is-public.decorator';
import { CreateOrganizationInviteUseCase } from '~/modules/organizations/application/use-cases/create-organization-invite.use-case';
import { FindAllOrganizationsUseCase } from '~/modules/organizations/application/use-cases/find-all-organizations.use-case';
import { FindOrganizationByUuidUseCase } from '~/modules/organizations/application/use-cases/find-organization-by-uuid.use-case';
import { GetOrganizationInviteUseCase } from '~/modules/organizations/application/use-cases/get-organization-invite.use-case';
import { UpdateOrganizationUseCase } from '~/modules/organizations/application/use-cases/update-organization.use-case';
import { CreateOrganizationInviteRequestDto } from '~/modules/organizations/presentation/http/dto/create-organization-invite-request.dto';
import { OrganizationInvitePreviewDto } from '~/modules/organizations/presentation/http/dto/organization-invite-preview.dto';
import { OrganizationInviteResponseDto } from '~/modules/organizations/presentation/http/dto/organization-invite-response.dto';
import { OrganizationResponseDto } from '~/modules/organizations/presentation/http/dto/organization-response.dto';
import { UpdateOrganizationRequestDto } from '~/modules/organizations/presentation/http/dto/update-organization-request.dto';
import { CreateInviteSwagger } from '~/modules/organizations/presentation/http/swagger/create-invite.swagger';
import { FindAllSwagger } from '~/modules/organizations/presentation/http/swagger/find-all.swagger';
import { FindByUuidSwagger } from '~/modules/organizations/presentation/http/swagger/find-by-uuid.swagger';
import { GetInviteSwagger } from '~/modules/organizations/presentation/http/swagger/get-invite.swagger';
import { UpdateSwagger } from '~/modules/organizations/presentation/http/swagger/update.swagger';

@ApiTags('organizations')
@IsAdmin()
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly findAllOrganizationsUseCase: FindAllOrganizationsUseCase,
    private readonly findOrganizationByUuidUseCase: FindOrganizationByUuidUseCase,
    private readonly createOrganizationInviteUseCase: CreateOrganizationInviteUseCase,
    private readonly getOrganizationInviteUseCase: GetOrganizationInviteUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
  ) {}

  @Get()
  @FindAllSwagger()
  findAll(): Promise<OrganizationResponseDto[]> {
    return this.findAllOrganizationsUseCase.execute();
  }

  @Post('invites')
  @HttpCode(HttpStatus.CREATED)
  @CreateInviteSwagger()
  createInvite(
    @Body() body: CreateOrganizationInviteRequestDto,
  ): Promise<OrganizationInviteResponseDto> {
    return this.createOrganizationInviteUseCase.execute(body.name);
  }

  @Get('invites/:token')
  @IsPublic()
  @GetInviteSwagger()
  getInvite(
    @Param('token') token: string,
  ): Promise<OrganizationInvitePreviewDto> {
    return this.getOrganizationInviteUseCase.execute(token);
  }

  @Get(':uuid')
  @FindByUuidSwagger()
  findByUuid(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ): Promise<OrganizationResponseDto> {
    return this.findOrganizationByUuidUseCase.execute(uuid);
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
      ...(body.active !== undefined ? { active: body.active } : {}),
    });
  }
}

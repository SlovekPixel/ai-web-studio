import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { PublicUserType } from '@repo/types';

import { CurrentUser } from '~/modules/auth/presentation/http/decorators/current-user.decorator';
import { IsPublic } from '~/modules/auth/presentation/http/decorators/is-public.decorator';
import { CreateOrganizationMemberInviteUseCase } from '~/modules/organizations/application/use-cases/create-organization-member-invite.use-case';
import { GetOrganizationMemberInviteUseCase } from '~/modules/organizations/application/use-cases/get-organization-member-invite.use-case';
import { OrganizationMemberInvitePreviewDto } from '~/modules/organizations/presentation/http/dto/organization-member-invite-preview.dto';
import { OrganizationMemberInviteResponseDto } from '~/modules/organizations/presentation/http/dto/organization-member-invite-response.dto';
import { CreateMemberInviteSwagger } from '~/modules/organizations/presentation/http/swagger/create-member-invite.swagger';
import { GetMemberInviteSwagger } from '~/modules/organizations/presentation/http/swagger/get-member-invite.swagger';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationMemberInvitesController {
  constructor(
    private readonly createOrganizationMemberInviteUseCase: CreateOrganizationMemberInviteUseCase,
    private readonly getOrganizationMemberInviteUseCase: GetOrganizationMemberInviteUseCase,
  ) {}

  @Post('member-invites')
  @HttpCode(HttpStatus.CREATED)
  @CreateMemberInviteSwagger()
  createMemberInvite(
    @CurrentUser() user: PublicUserType,
  ): Promise<OrganizationMemberInviteResponseDto> {
    return this.createOrganizationMemberInviteUseCase.execute(user);
  }

  @Get('member-invites/:token')
  @IsPublic()
  @GetMemberInviteSwagger()
  getMemberInvite(
    @Param('token') token: string,
  ): Promise<OrganizationMemberInvitePreviewDto> {
    return this.getOrganizationMemberInviteUseCase.execute(token);
  }
}

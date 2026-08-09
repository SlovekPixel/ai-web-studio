import { Body, Controller, Delete, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { PublicUserType } from '@repo/types';

import { CurrentUser } from '~/modules/auth/presentation/http/decorators/current-user.decorator';
import { IsUser } from '~/modules/auth/presentation/http/decorators/is-user.decorator';
import { DeleteComfyUiIntegrationUseCase } from '~/modules/integrations/application/use-cases/delete-comfyui-integration.use-case';
import { GetComfyUiIntegrationStatusUseCase } from '~/modules/integrations/application/use-cases/get-comfyui-integration-status.use-case';
import { SaveComfyUiIntegrationTokenUseCase } from '~/modules/integrations/application/use-cases/save-comfyui-integration-token.use-case';
import { ComfyUiIntegrationStatusResponseDto } from '~/modules/integrations/presentation/http/dto/comfyui-integration-status-response.dto';
import { SaveComfyUiIntegrationTokenRequestDto } from '~/modules/integrations/presentation/http/dto/save-comfyui-integration-token-request.dto';
import { DeleteIntegrationSwagger } from '~/modules/integrations/presentation/http/swagger/delete-integration.swagger';
import { GetStatusSwagger } from '~/modules/integrations/presentation/http/swagger/get-status.swagger';
import { SaveTokenSwagger } from '~/modules/integrations/presentation/http/swagger/save-token.swagger';

@ApiTags('integrations')
@IsUser()
@Controller('integrations/comfyui-integration')
export class ComfyUiIntegrationController {
  constructor(
    private readonly getComfyUiIntegrationStatusUseCase: GetComfyUiIntegrationStatusUseCase,
    private readonly saveComfyUiIntegrationTokenUseCase: SaveComfyUiIntegrationTokenUseCase,
    private readonly deleteComfyUiIntegrationUseCase: DeleteComfyUiIntegrationUseCase,
  ) {}

  @Get()
  @GetStatusSwagger()
  getStatus(
    @CurrentUser() user: PublicUserType,
  ): Promise<ComfyUiIntegrationStatusResponseDto> {
    return this.getComfyUiIntegrationStatusUseCase.execute(user.orgId);
  }

  @Put()
  @SaveTokenSwagger()
  saveToken(
    @CurrentUser() user: PublicUserType,
    @Body() body: SaveComfyUiIntegrationTokenRequestDto,
  ): Promise<ComfyUiIntegrationStatusResponseDto> {
    return this.saveComfyUiIntegrationTokenUseCase.execute(user, body.token);
  }

  @Delete()
  @DeleteIntegrationSwagger()
  deleteIntegration(
    @CurrentUser() user: PublicUserType,
  ): Promise<ComfyUiIntegrationStatusResponseDto> {
    return this.deleteComfyUiIntegrationUseCase.execute(user);
  }
}

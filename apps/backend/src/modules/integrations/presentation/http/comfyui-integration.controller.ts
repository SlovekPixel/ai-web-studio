import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { PublicUserType } from '@repo/types';

import { CurrentUser } from '~/modules/auth/presentation/http/decorators/current-user.decorator';
import { IsUser } from '~/modules/auth/presentation/http/decorators/is-user.decorator';
import { GetComfyUiIntegrationTokenUseCase } from '~/modules/integrations/application/use-cases/get-comfyui-integration-token.use-case';
import { SaveComfyUiIntegrationTokenUseCase } from '~/modules/integrations/application/use-cases/save-comfyui-integration-token.use-case';
import { ComfyUiIntegrationResponseDto } from '~/modules/integrations/presentation/http/dto/comfyui-integration-response.dto';
import { SaveComfyUiIntegrationTokenRequestDto } from '~/modules/integrations/presentation/http/dto/save-comfyui-integration-token-request.dto';
import { GetTokenSwagger } from '~/modules/integrations/presentation/http/swagger/get-token.swagger';
import { SaveTokenSwagger } from '~/modules/integrations/presentation/http/swagger/save-token.swagger';

@ApiTags('integrations')
@IsUser()
@Controller('integrations/comfyui-integration')
export class ComfyUiIntegrationController {
  constructor(
    private readonly getComfyUiIntegrationTokenUseCase: GetComfyUiIntegrationTokenUseCase,
    private readonly saveComfyUiIntegrationTokenUseCase: SaveComfyUiIntegrationTokenUseCase,
  ) {}

  @Get()
  @GetTokenSwagger()
  getToken(
    @CurrentUser() user: PublicUserType,
  ): Promise<ComfyUiIntegrationResponseDto> {
    return this.getComfyUiIntegrationTokenUseCase.execute(user.orgId);
  }

  @Put()
  @SaveTokenSwagger()
  saveToken(
    @CurrentUser() user: PublicUserType,
    @Body() body: SaveComfyUiIntegrationTokenRequestDto,
  ): Promise<ComfyUiIntegrationResponseDto> {
    return this.saveComfyUiIntegrationTokenUseCase.execute(
      user.orgId,
      body.token,
    );
  }
}

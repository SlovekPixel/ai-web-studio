import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ComfyUiIntegration } from '~/modules/integrations/domain/entities/comfyui-integration.entity';
import type {
  IComfyUiIntegrationRepository,
  SaveComfyUiIntegrationTokenData,
} from '~/modules/integrations/domain/ports/comfyui-integration.repository.port';
import { ComfyUiIntegrationOrmEntity } from '~/modules/integrations/infrastructure/persistence/typeorm/comfyui-integration.orm-entity';

@Injectable()
export class TypeOrmComfyUiIntegrationRepository implements IComfyUiIntegrationRepository {
  constructor(
    @InjectRepository(ComfyUiIntegrationOrmEntity)
    private readonly comfyUiIntegrationRepository: Repository<ComfyUiIntegrationOrmEntity>,
  ) {}

  async findByOrgId(orgId: string): Promise<ComfyUiIntegration | null> {
    const entity = await this.comfyUiIntegrationRepository.findOne({
      where: { orgId },
    });

    return entity ? entity.toDomain() : null;
  }

  async save(
    data: SaveComfyUiIntegrationTokenData,
  ): Promise<ComfyUiIntegration> {
    const existing = await this.comfyUiIntegrationRepository.findOne({
      where: { orgId: data.orgId },
    });

    if (existing) {
      existing.token = data.token;
      const saved = await this.comfyUiIntegrationRepository.save(existing);
      return saved.toDomain();
    }

    const entity = ComfyUiIntegrationOrmEntity.fromSave(data);
    const saved = await this.comfyUiIntegrationRepository.save(entity);
    return saved.toDomain();
  }

  async deleteByOrgId(orgId: string): Promise<void> {
    await this.comfyUiIntegrationRepository.delete({ orgId });
  }
}

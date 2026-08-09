import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ComfyUiIntegration } from '~/modules/integrations/domain/entities/comfyui-integration.entity';
import type { SaveComfyUiIntegrationTokenData } from '~/modules/integrations/domain/ports/comfyui-integration.repository.port';
import { OrganizationOrmEntity } from '~/modules/organizations/infrastructure/persistence/typeorm/organization.orm-entity';

@Entity({ name: 'comfyui_integration' })
export class ComfyUiIntegrationOrmEntity {
  @PrimaryColumn({ name: 'org_id', type: 'uuid' })
  orgId!: string;

  @OneToOne(() => OrganizationOrmEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'org_id' })
  organization!: OrganizationOrmEntity;

  @Column({ type: 'varchar', length: 2048 })
  token!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  toDomain(): ComfyUiIntegration {
    return new ComfyUiIntegration(
      this.orgId,
      this.token,
      this.createdAt,
      this.updatedAt,
    );
  }

  static fromSave(
    data: SaveComfyUiIntegrationTokenData,
  ): ComfyUiIntegrationOrmEntity {
    const entity = new ComfyUiIntegrationOrmEntity();
    entity.orgId = data.orgId;
    entity.token = data.token;
    return entity;
  }
}

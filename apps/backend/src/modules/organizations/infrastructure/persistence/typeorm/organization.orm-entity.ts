import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { Organization } from '~/modules/organizations/domain/entities/organization.entity';
import type { CreateOrganizationData } from '~/modules/organizations/domain/ports/organization.repository.port';
import { UserOrmEntity } from '~/modules/users/infrastructure/persistence/typeorm/user.orm-entity';

@Entity({ name: 'organizations' })
export class OrganizationOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 12, nullable: true, unique: true })
  inn!: string | null;

  @ManyToOne(() => UserOrmEntity, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner!: UserOrmEntity;

  @RelationId((organization: OrganizationOrmEntity) => organization.owner)
  ownerId!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @OneToMany(() => UserOrmEntity, (user) => user.organization)
  users!: UserOrmEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  toDomain(): Organization {
    return new Organization(
      this.uuid,
      this.name,
      this.description,
      this.inn,
      this.ownerId ?? this.owner?.id,
      this.active,
      this.createdAt,
      this.updatedAt,
    );
  }

  static fromCreate(data: CreateOrganizationData): OrganizationOrmEntity {
    const entity = new OrganizationOrmEntity();
    entity.name = data.name;
    entity.description = data.description;
    entity.inn = data.inn;
    entity.owner = { id: data.ownerId } as UserOrmEntity;
    entity.active = true;
    return entity;
  }
}

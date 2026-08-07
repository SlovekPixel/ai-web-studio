import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { OrganizationOrmEntity } from '~/modules/organizations/infrastructure/persistence/typeorm/organization.orm-entity';
import { User } from '~/modules/users/domain/entities/user.entity';
import type { CreateUserData } from '~/modules/users/domain/ports/user.repository.port';

@Entity({ name: 'users' })
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  login!: string;

  @Column({ name: 'hash_password', type: 'varchar', length: 255 })
  hashPassword!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string | null;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @ManyToOne(() => OrganizationOrmEntity, (org) => org.users, {
    nullable: true,
  })
  @JoinColumn({ name: 'org_id' })
  organization!: OrganizationOrmEntity | null;

  @RelationId((user: UserOrmEntity) => user.organization)
  orgId!: string | null;

  @Column({ name: 'login_at', type: 'timestamptz', nullable: true })
  loginAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  toDomain(): User {
    return new User(
      this.id,
      this.login,
      this.hashPassword,
      this.email,
      this.fullName,
      this.active,
      this.orgId ?? this.organization?.uuid ?? null,
      this.organization ? this.organization.toDomain() : null,
      this.loginAt,
      this.createdAt,
      this.updatedAt,
    );
  }

  static fromDomain(user: User): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.id = user.id;
    entity.login = user.login;
    entity.hashPassword = user.hashPassword;
    entity.email = user.email;
    entity.fullName = user.fullName;
    entity.active = user.active;
    entity.loginAt = user.loginAt;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }

  static fromCreate(data: CreateUserData): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.login = data.login;
    entity.hashPassword = data.hashPassword;
    entity.email = data.email ?? null;
    entity.fullName = data.fullName;
    entity.active = true;
    entity.organization = null;
    entity.loginAt = null;
    return entity;
  }
}

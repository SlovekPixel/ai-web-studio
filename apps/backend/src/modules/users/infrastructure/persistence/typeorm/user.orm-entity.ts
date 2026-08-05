import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '~/modules/users/domain/entities/user.entity';
import type { CreateUserData } from '~/modules/users/domain/ports/user.repository.port';

@Entity({ name: 'users' })
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid!: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  login!: string;

  @Column({ name: 'hash_password', type: 'varchar', length: 255 })
  hashPassword!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  toDomain(): User {
    return new User(
      this.uuid,
      this.login,
      this.hashPassword,
      this.createdAt,
      this.updatedAt,
    );
  }

  static fromDomain(user: User): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.uuid = user.uuid;
    entity.login = user.login;
    entity.hashPassword = user.hashPassword;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }

  static fromCreate(data: CreateUserData): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.login = data.login;
    entity.hashPassword = data.hashPassword;
    return entity;
  }
}

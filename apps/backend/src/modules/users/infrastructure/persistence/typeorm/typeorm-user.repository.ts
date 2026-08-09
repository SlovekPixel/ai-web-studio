import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrganizationOrmEntity } from '~/modules/organizations/infrastructure/persistence/typeorm/organization.orm-entity';
import { User } from '~/modules/users/domain/entities/user.entity';
import type {
  CreateUserData,
  IUserRepository,
  UpdateProfileData,
} from '~/modules/users/domain/ports/user.repository.port';
import { UserOrmEntity } from '~/modules/users/infrastructure/persistence/typeorm/user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly usersRepository: Repository<UserOrmEntity>,
  ) {}

  count(): Promise<number> {
    return this.usersRepository.count();
  }

  async findAll(): Promise<User[]> {
    const entities = await this.usersRepository.find({
      relations: { organization: true },
      order: { createdAt: 'ASC' },
    });

    return entities.map((entity) => entity.toDomain());
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.usersRepository.findOne({
      where: { id },
      relations: { organization: true },
    });

    return entity ? entity.toDomain() : null;
  }

  async findByLogin(login: string): Promise<User | null> {
    const entity = await this.usersRepository.findOne({
      where: { login },
      relations: { organization: true },
    });

    return entity ? entity.toDomain() : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.usersRepository.findOne({
      where: { email },
      relations: { organization: true },
    });

    return entity ? entity.toDomain() : null;
  }

  async create(data: CreateUserData): Promise<User> {
    const entity = UserOrmEntity.fromCreate(data);
    const saved = await this.usersRepository.save(entity);

    return saved.toDomain();
  }

  async updateOrgId(userId: string, orgId: string): Promise<User> {
    const entity = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!entity) {
      throw new Error(`User ${userId} not found before org assignment`);
    }

    entity.organization = { uuid: orgId } as OrganizationOrmEntity;
    await this.usersRepository.save(entity);

    const updated = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { organization: true },
    });

    if (!updated) {
      throw new Error(`User ${userId} not found after org assignment`);
    }

    return updated.toDomain();
  }

  async updateLoginAt(userId: string, loginAt: Date): Promise<User> {
    await this.usersRepository.update({ id: userId }, { loginAt });

    const entity = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { organization: true },
    });

    if (!entity) {
      throw new Error(`User ${userId} not found after login_at update`);
    }

    return entity.toDomain();
  }

  async updateActive(userId: string, active: boolean): Promise<User> {
    await this.usersRepository.update({ id: userId }, { active });

    const entity = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { organization: true },
    });

    if (!entity) {
      throw new Error(`User ${userId} not found after active update`);
    }

    return entity.toDomain();
  }

  async updateProfile(userId: string, data: UpdateProfileData): Promise<User> {
    await this.usersRepository.update({ id: userId }, data);

    const entity = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { organization: true },
    });

    if (!entity) {
      throw new Error(`User ${userId} not found after profile update`);
    }

    return entity.toDomain();
  }

  async updatePassword(userId: string, hashPassword: string): Promise<User> {
    await this.usersRepository.update({ id: userId }, { hashPassword });

    const entity = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { organization: true },
    });

    if (!entity) {
      throw new Error(`User ${userId} not found after password update`);
    }

    return entity.toDomain();
  }
}

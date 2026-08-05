import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '~/modules/users/domain/entities/user.entity';
import type {
  CreateUserData,
  IUserRepository,
} from '~/modules/users/domain/ports/user.repository.port';
import { UserOrmEntity } from '~/modules/users/infrastructure/persistence/typeorm/user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly usersRepository: Repository<UserOrmEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const entities = await this.usersRepository.find({
      order: { createdAt: 'ASC' },
    });

    return entities.map((entity) => entity.toDomain());
  }

  async findByUuid(uuid: string): Promise<User | null> {
    const entity = await this.usersRepository.findOne({ where: { uuid } });

    return entity ? entity.toDomain() : null;
  }

  async findByLogin(login: string): Promise<User | null> {
    const entity = await this.usersRepository.findOne({ where: { login } });

    return entity ? entity.toDomain() : null;
  }

  async create(data: CreateUserData): Promise<User> {
    const entity = UserOrmEntity.fromCreate(data);
    const saved = await this.usersRepository.save(entity);

    return saved.toDomain();
  }
}

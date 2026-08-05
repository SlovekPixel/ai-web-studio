import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type {
  PublicUser,
  User,
} from '~/modules/users/domain/entities/user.entity';
import {
  USER_REPOSITORY,
  type CreateUserData,
  type IUserRepository,
} from '~/modules/users/domain/ports/user.repository.port';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<PublicUser[]> {
    const users = await this.userRepository.findAll();

    return users.map((user) => user.toPublic());
  }

  async findByUuid(uuid: string): Promise<PublicUser> {
    const user = await this.userRepository.findByUuid(uuid);

    if (!user) {
      throw new NotFoundException(`User with uuid "${uuid}" not found`);
    }

    return user.toPublic();
  }

  findByLogin(login: string): Promise<User | null> {
    return this.userRepository.findByLogin(login);
  }

  create(data: CreateUserData): Promise<User> {
    return this.userRepository.create(data);
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
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
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async findAll(): Promise<PublicUser[]> {
    const users = await this.userRepository.findAll();

    return users.map((user) => user.toPublic());
  }

  async findById(id: string): Promise<PublicUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(
        this.i18nService.translate('ERRORS.USER_NOT_FOUND', {
          userId: id,
        }),
      );
    }

    return user.toPublic();
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.userRepository.findByLogin(login);
  }

  async create(data: CreateUserData): Promise<User> {
    return this.userRepository.create(data);
  }

  async assignOrganization(userId: string, orgId: string): Promise<User> {
    return this.userRepository.updateOrgId(userId, orgId);
  }

  async touchLoginAt(userId: string): Promise<User> {
    return this.userRepository.updateLoginAt(userId, new Date());
  }
}

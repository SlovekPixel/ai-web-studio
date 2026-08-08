import { Inject, Injectable } from '@nestjs/common';

import type { PublicUserType } from '@repo/types';

import {
  USER_REPOSITORY,
  type IUserRepository,
} from '~/modules/users/domain/ports/user.repository.port';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<PublicUserType[]> {
    const users = await this.userRepository.findAll();

    return users.map((user) => user.toPublic());
  }
}

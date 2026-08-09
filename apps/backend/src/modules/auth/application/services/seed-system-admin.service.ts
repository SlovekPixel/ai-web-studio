import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import {
  LOGGER_SERVICE,
  type ILoggerService,
} from '~/core/logging/domain/ports/logger.service.port';
import {
  SEED_ADMIN_FULL_NAME,
  SEED_ADMIN_LOGIN,
  SEED_ADMIN_PASSWORD,
} from '~/modules/auth/domain/constants/seed-system-admin';
import {
  PASSWORD_HASHER,
  type IPasswordHasher,
} from '~/modules/auth/domain/ports/password-hasher.port';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '~/modules/users/domain/ports/user.repository.port';

@Injectable()
export class SeedSystemAdminService implements OnModuleInit {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(LOGGER_SERVICE)
    private readonly logger: ILoggerService,
  ) {}

  async onModuleInit(): Promise<void> {
    const usersCount = await this.userRepository.count();

    if (usersCount > 0) {
      return;
    }

    const hashPassword = await this.passwordHasher.hash(SEED_ADMIN_PASSWORD);

    await this.userRepository.create({
      login: SEED_ADMIN_LOGIN,
      fullName: SEED_ADMIN_FULL_NAME,
      hashPassword,
    });

    this.logger.warn(
      `Seed system admin created (login: ${SEED_ADMIN_LOGIN}). Change the default password after first login.`,
      SeedSystemAdminService.name,
    );
  }
}

import { ConflictException, Inject, Injectable } from '@nestjs/common';

import type { PublicUserType } from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  PASSWORD_HASHER,
  type IPasswordHasher,
} from '~/modules/auth/domain/ports/password-hasher.port';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '~/modules/users/domain/ports/user.repository.port';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(
    login: string,
    password: string,
    fullName: string,
  ): Promise<PublicUserType> {
    const existing = await this.userRepository.findByLogin(login);

    if (existing) {
      throw new ConflictException(
        this.i18nService.translate('ERRORS.LOGIN_ALREADY_TAKEN', { login }),
      );
    }

    const hashPassword = await this.passwordHasher.hash(password);
    const user = await this.userRepository.create({
      login,
      hashPassword,
      fullName,
    });

    return user.toPublic();
  }
}

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

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
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(login: string, password: string): Promise<PublicUserType> {
    const user = await this.userRepository.findByLogin(login);

    if (!user) {
      throw new UnauthorizedException(
        this.i18nService.translate('ERRORS.INVALID_CREDENTIALS'),
      );
    }

    const isValid = await this.passwordHasher.compare(
      password,
      user.hashPassword,
    );

    if (!isValid) {
      throw new UnauthorizedException(
        this.i18nService.translate('ERRORS.INVALID_CREDENTIALS'),
      );
    }

    const updated = await this.userRepository.updateLoginAt(
      user.id,
      new Date(),
    );

    return updated.toPublic();
  }
}

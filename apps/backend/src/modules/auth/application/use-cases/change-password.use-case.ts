import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { ChangePasswordRequestType } from '@repo/types';

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
export class ChangePasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(
    userId: string,
    data: ChangePasswordRequestType,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(
        this.i18nService.translate('ERRORS.USER_NOT_FOUND', {
          userId,
        }),
      );
    }

    const isCurrentValid = await this.passwordHasher.compare(
      data.currentPassword,
      user.hashPassword,
    );

    if (!isCurrentValid) {
      throw new UnauthorizedException(
        this.i18nService.translate('ERRORS.INVALID_CURRENT_PASSWORD'),
      );
    }

    const hashPassword = await this.passwordHasher.hash(data.newPassword);
    await this.userRepository.updatePassword(userId, hashPassword);
  }
}

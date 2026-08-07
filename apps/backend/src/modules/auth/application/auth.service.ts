import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { PublicUserType } from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  PASSWORD_HASHER,
  type IPasswordHasher,
} from '~/modules/auth/domain/ports/password-hasher.port';
import { UserService } from '~/modules/users/application/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async register(
    login: string,
    password: string,
    fullName: string,
  ): Promise<PublicUserType> {
    const existing = await this.userService.findByLogin(login);

    if (existing) {
      throw new ConflictException(
        this.i18nService.translate('ERRORS.LOGIN_ALREADY_TAKEN', { login }),
      );
    }

    const hashPassword = await this.passwordHasher.hash(password);
    const user = await this.userService.create({
      login,
      hashPassword,
      fullName,
    });

    return user.toPublic();
  }

  async login(login: string, password: string): Promise<PublicUserType> {
    const user = await this.userService.findByLogin(login);

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

    const updated = await this.userService.touchLoginAt(user.id);

    return updated.toPublic();
  }
}

import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  PASSWORD_HASHER,
  type IPasswordHasher,
} from '~/modules/auth/domain/ports/password-hasher.port';
import { UserService } from '~/modules/users/application/user.service';
import type { PublicUser } from '~/modules/users/domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async register(login: string, password: string): Promise<PublicUser> {
    const existing = await this.userService.findByLogin(login);

    if (existing) {
      throw new ConflictException(
        this.i18nService.translate('ERRORS.LOGIN_ALREADY_TAKEN', { login }),
      );
    }

    const hashPassword = await this.passwordHasher.hash(password);
    const user = await this.userService.create({ login, hashPassword });

    return user.toPublic();
  }

  async login(login: string, password: string): Promise<PublicUser> {
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

    return user.toPublic();
  }
}

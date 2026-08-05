import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

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
  ) {}

  async register(login: string, password: string): Promise<PublicUser> {
    const existing = await this.userService.findByLogin(login);

    if (existing) {
      throw new ConflictException(`Login "${login}" is already taken`);
    }

    const hashPassword = await this.passwordHasher.hash(password);
    const user = await this.userService.create({ login, hashPassword });

    return user.toPublic();
  }

  async login(login: string, password: string): Promise<PublicUser> {
    const user = await this.userService.findByLogin(login);

    if (!user) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const isValid = await this.passwordHasher.compare(
      password,
      user.hashPassword,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid login or password');
    }

    return user.toPublic();
  }
}

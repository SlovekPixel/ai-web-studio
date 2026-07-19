import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type {
  AuthRequestType,
  AuthResponseType,
  RefreshRequestType,
  RegisterRequestType,
} from '@repo/types';

import { LoggerService } from '~/core/logging/application/logger.service';
import type { IAuthService } from '~/modules/auth/domain/ports/auth.service.port';
import {
  PASSWORD_HASHER,
  type IPasswordHasher,
} from '~/modules/auth/domain/ports/password-hasher.port';
import {
  TOKEN_SERVICE,
  type ITokenService,
} from '~/modules/auth/domain/ports/token.service.port';
import { User } from '~/modules/user/domain/entities/user.entity';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '~/modules/user/domain/ports/user.repository.port';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly logger: LoggerService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async register(payload: RegisterRequestType): Promise<AuthResponseType> {
    const email = payload.email.toLowerCase();
    const exists = await this.userRepository.existsByEmail(email);

    if (exists) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await this.passwordHasher.hash(payload.password);
    const user = User.create({
      id: randomUUID(),
      email,
      passwordHash,
      firstName: payload.firstName,
      lastName: payload.lastName,
    });

    const savedUser = await this.userRepository.save(user);
    const publicUser = savedUser.toPublic();
    const tokens = await this.tokenService.issueTokens(publicUser);

    this.logger.log(
      `User registered: ${publicUser.email}`,
      AuthService.name,
    );

    return {
      ...tokens,
      user: publicUser,
    };
  }

  async login(credentials: AuthRequestType): Promise<AuthResponseType> {
    const email = credentials.email.toLowerCase();
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.passwordHasher.compare(
      credentials.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const publicUser = user.toPublic();
    const tokens = await this.tokenService.issueTokens(publicUser);

    this.logger.log(`Login successful: ${publicUser.email}`, AuthService.name);

    return {
      ...tokens,
      user: publicUser,
    };
  }

  async refresh(payload: RefreshRequestType): Promise<AuthResponseType> {
    const tokenUser = await this.tokenService.verifyRefreshToken(
      payload.refreshToken,
    );
    const user = await this.userRepository.findById(tokenUser.id);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const publicUser = user.toPublic();
    const tokens = await this.tokenService.issueTokens(publicUser);

    return {
      ...tokens,
      user: publicUser,
    };
  }
}

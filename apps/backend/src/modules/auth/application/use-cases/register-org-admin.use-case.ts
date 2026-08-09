import {
  ConflictException,
  GoneException,
  Inject,
  Injectable,
} from '@nestjs/common';

import type { RegisterOrgAdminRequestType } from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import { IssueAuthSessionService } from '~/modules/auth/application/services/issue-auth-session.service';
import {
  PASSWORD_HASHER,
  type IPasswordHasher,
} from '~/modules/auth/domain/ports/password-hasher.port';
import type { IssuedTokenPair } from '~/modules/auth/domain/ports/token-service.port';
import { CreateOrganizationUseCase } from '~/modules/organizations/application/use-cases/create-organization.use-case';
import {
  ORGANIZATION_INVITE_STORE,
  type IOrganizationInviteStore,
} from '~/modules/organizations/domain/ports/organization-invite.store.port';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '~/modules/organizations/domain/ports/organization.repository.port';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '~/modules/users/domain/ports/user.repository.port';

@Injectable()
export class RegisterOrgAdminUseCase {
  constructor(
    @Inject(ORGANIZATION_INVITE_STORE)
    private readonly inviteStore: IOrganizationInviteStore,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
    private readonly issueAuthSessionService: IssueAuthSessionService,
  ) {}

  async execute(data: RegisterOrgAdminRequestType): Promise<IssuedTokenPair> {
    const invite = await this.inviteStore.consume(data.token);

    if (!invite) {
      throw new GoneException(
        this.i18nService.translate('ERRORS.ORGANIZATION_INVITE_INVALID'),
      );
    }

    const existingUser = await this.userRepository.findByLogin(data.login);

    if (existingUser) {
      throw new ConflictException(
        this.i18nService.translate('ERRORS.LOGIN_ALREADY_TAKEN', {
          login: data.login,
        }),
      );
    }

    const existingByName = await this.organizationRepository.findByName(
      invite.name,
    );

    if (existingByName) {
      throw new ConflictException(
        this.i18nService.translate('ERRORS.ORGANIZATION_NAME_TAKEN', {
          name: invite.name,
        }),
      );
    }

    const inn = data.inn ?? null;

    if (inn) {
      const existingByInn = await this.organizationRepository.findByInn(inn);

      if (existingByInn) {
        throw new ConflictException(
          this.i18nService.translate('ERRORS.ORGANIZATION_INN_TAKEN', {
            inn,
          }),
        );
      }
    }

    const hashPassword = await this.passwordHasher.hash(data.password);
    const user = await this.userRepository.create({
      login: data.login,
      hashPassword,
      fullName: data.fullName,
    });

    await this.createOrganizationUseCase.execute({
      name: invite.name,
      ownerId: user.id,
      description: data.description ?? null,
      inn,
    });

    const owner = await this.userRepository.findById(user.id);

    if (!owner) {
      throw new ConflictException(
        this.i18nService.translate('ERRORS.USER_NOT_FOUND', {
          userId: user.id,
        }),
      );
    }

    return this.issueAuthSessionService.execute(owner.toPublic());
  }
}

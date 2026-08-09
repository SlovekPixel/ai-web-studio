import {
  ConflictException,
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { RegisterOrgUserRequestType } from '@repo/types';

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
import {
  ORGANIZATION_MEMBER_INVITE_STORE,
  type IOrganizationMemberInviteStore,
} from '~/modules/organizations/domain/ports/organization-member-invite.store.port';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from '~/modules/organizations/domain/ports/organization.repository.port';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '~/modules/users/domain/ports/user.repository.port';

@Injectable()
export class RegisterOrgUserUseCase {
  constructor(
    @Inject(ORGANIZATION_MEMBER_INVITE_STORE)
    private readonly inviteStore: IOrganizationMemberInviteStore,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
    private readonly issueAuthSessionService: IssueAuthSessionService,
  ) {}

  async execute(data: RegisterOrgUserRequestType): Promise<IssuedTokenPair> {
    const invite = await this.inviteStore.consume(data.token);

    if (!invite) {
      throw new GoneException(
        this.i18nService.translate('ERRORS.ORGANIZATION_INVITE_INVALID'),
      );
    }

    const organization = await this.organizationRepository.findByUuid(
      invite.organizationUuid,
    );

    if (!organization) {
      throw new NotFoundException(
        this.i18nService.translate('ERRORS.ORGANIZATION_NOT_FOUND', {
          organizationUuid: invite.organizationUuid,
        }),
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

    const hashPassword = await this.passwordHasher.hash(data.password);
    const user = await this.userRepository.create({
      login: data.login,
      hashPassword,
      fullName: data.fullName,
    });

    const member = await this.userRepository.updateOrgId(
      user.id,
      invite.organizationUuid,
    );

    return this.issueAuthSessionService.execute(member.toPublic());
  }
}

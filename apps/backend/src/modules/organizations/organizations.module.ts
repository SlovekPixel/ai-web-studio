import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateOrganizationInviteUseCase } from '~/modules/organizations/application/use-cases/create-organization-invite.use-case';
import { CreateOrganizationMemberInviteUseCase } from '~/modules/organizations/application/use-cases/create-organization-member-invite.use-case';
import { CreateOrganizationUseCase } from '~/modules/organizations/application/use-cases/create-organization.use-case';
import { FindAllOrganizationsUseCase } from '~/modules/organizations/application/use-cases/find-all-organizations.use-case';
import { FindOrganizationByUuidUseCase } from '~/modules/organizations/application/use-cases/find-organization-by-uuid.use-case';
import { FindOrganizationMembersUseCase } from '~/modules/organizations/application/use-cases/find-organization-members.use-case';
import { GetOrganizationInviteUseCase } from '~/modules/organizations/application/use-cases/get-organization-invite.use-case';
import { GetOrganizationMemberInviteUseCase } from '~/modules/organizations/application/use-cases/get-organization-member-invite.use-case';
import { UpdateOrganizationUseCase } from '~/modules/organizations/application/use-cases/update-organization.use-case';
import { ORGANIZATION_INVITE_STORE } from '~/modules/organizations/domain/ports/organization-invite.store.port';
import { ORGANIZATION_MEMBER_INVITE_STORE } from '~/modules/organizations/domain/ports/organization-member-invite.store.port';
import { ORGANIZATION_REPOSITORY } from '~/modules/organizations/domain/ports/organization.repository.port';
import { OrganizationOrmEntity } from '~/modules/organizations/infrastructure/persistence/typeorm/organization.orm-entity';
import { RedisOrganizationInviteStore } from '~/modules/organizations/infrastructure/redis/redis-organization-invite.store';
import { RedisOrganizationMemberInviteStore } from '~/modules/organizations/infrastructure/redis/redis-organization-member-invite.store';
import { TypeOrmOrganizationRepository } from '~/modules/organizations/infrastructure/persistence/typeorm/typeorm-organization.repository';
import { OrganizationMemberInvitesController } from '~/modules/organizations/presentation/http/organization-member-invites.controller';
import { OrganizationsController } from '~/modules/organizations/presentation/http/organizations.controller';
import { UsersModule } from '~/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationOrmEntity]), UsersModule],
  controllers: [OrganizationMemberInvitesController, OrganizationsController],
  providers: [
    FindAllOrganizationsUseCase,
    FindOrganizationByUuidUseCase,
    CreateOrganizationInviteUseCase,
    GetOrganizationInviteUseCase,
    CreateOrganizationMemberInviteUseCase,
    GetOrganizationMemberInviteUseCase,
    FindOrganizationMembersUseCase,
    CreateOrganizationUseCase,
    UpdateOrganizationUseCase,
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: TypeOrmOrganizationRepository,
    },
    {
      provide: ORGANIZATION_INVITE_STORE,
      useClass: RedisOrganizationInviteStore,
    },
    {
      provide: ORGANIZATION_MEMBER_INVITE_STORE,
      useClass: RedisOrganizationMemberInviteStore,
    },
  ],
  exports: [
    ORGANIZATION_REPOSITORY,
    ORGANIZATION_INVITE_STORE,
    ORGANIZATION_MEMBER_INVITE_STORE,
    CreateOrganizationUseCase,
  ],
})
export class OrganizationsModule {}

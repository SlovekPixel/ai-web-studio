import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddUserToOrganizationUseCase } from '~/modules/organizations/application/use-cases/add-user-to-organization.use-case';
import { CreateOrganizationUseCase } from '~/modules/organizations/application/use-cases/create-organization.use-case';
import { FindAllOrganizationsUseCase } from '~/modules/organizations/application/use-cases/find-all-organizations.use-case';
import { FindOrganizationByUuidUseCase } from '~/modules/organizations/application/use-cases/find-organization-by-uuid.use-case';
import { UpdateOrganizationUseCase } from '~/modules/organizations/application/use-cases/update-organization.use-case';
import { ORGANIZATION_REPOSITORY } from '~/modules/organizations/domain/ports/organization.repository.port';
import { OrganizationOrmEntity } from '~/modules/organizations/infrastructure/persistence/typeorm/organization.orm-entity';
import { TypeOrmOrganizationRepository } from '~/modules/organizations/infrastructure/persistence/typeorm/typeorm-organization.repository';
import { OrganizationsController } from '~/modules/organizations/presentation/http/organizations.controller';
import { UsersModule } from '~/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationOrmEntity]), UsersModule],
  controllers: [OrganizationsController],
  providers: [
    FindAllOrganizationsUseCase,
    FindOrganizationByUuidUseCase,
    CreateOrganizationUseCase,
    UpdateOrganizationUseCase,
    AddUserToOrganizationUseCase,
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: TypeOrmOrganizationRepository,
    },
  ],
  exports: [ORGANIZATION_REPOSITORY],
})
export class OrganizationsModule {}

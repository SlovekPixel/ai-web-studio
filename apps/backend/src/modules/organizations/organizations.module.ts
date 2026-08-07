import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationService } from '~/modules/organizations/application/organization.service';
import { ORGANIZATION_REPOSITORY } from '~/modules/organizations/domain/ports/organization.repository.port';
import { OrganizationOrmEntity } from '~/modules/organizations/infrastructure/persistence/typeorm/organization.orm-entity';
import { TypeOrmOrganizationRepository } from '~/modules/organizations/infrastructure/persistence/typeorm/typeorm-organization.repository';
import { OrganizationsController } from '~/modules/organizations/presentation/http/organizations.controller';
import { UsersModule } from '~/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationOrmEntity]), UsersModule],
  controllers: [OrganizationsController],
  providers: [
    OrganizationService,
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: TypeOrmOrganizationRepository,
    },
  ],
  exports: [OrganizationService, ORGANIZATION_REPOSITORY],
})
export class OrganizationsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { USER_REPOSITORY } from '~/modules/user/domain/ports/user.repository.port';
import { TypeOrmUserRepository } from '~/modules/user/infrastructure/persistence/typeorm/typeorm-user.repository';
import { UserOrmEntity } from '~/modules/user/infrastructure/persistence/typeorm/user.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [
    TypeOrmUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: TypeOrmUserRepository,
    },
  ],
  exports: [USER_REPOSITORY, TypeOrmModule],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '~/modules/users/application/user.service';
import { USER_REPOSITORY } from '~/modules/users/domain/ports/user.repository.port';
import { TypeOrmUserRepository } from '~/modules/users/infrastructure/persistence/typeorm/typeorm-user.repository';
import { UserOrmEntity } from '~/modules/users/infrastructure/persistence/typeorm/user.orm-entity';
import { UsersController } from '~/modules/users/presentation/http/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [UserService, USER_REPOSITORY],
})
export class UsersModule {}

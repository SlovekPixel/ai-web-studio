import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FindAllUsersUseCase } from '~/modules/users/application/use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from '~/modules/users/application/use-cases/find-user-by-id.use-case';
import { USER_REPOSITORY } from '~/modules/users/domain/ports/user.repository.port';
import { TypeOrmUserRepository } from '~/modules/users/infrastructure/persistence/typeorm/typeorm-user.repository';
import { UserOrmEntity } from '~/modules/users/infrastructure/persistence/typeorm/user.orm-entity';
import { UsersController } from '~/modules/users/presentation/http/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [
    FindAllUsersUseCase,
    FindUserByIdUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}

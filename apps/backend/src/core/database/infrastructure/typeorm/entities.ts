import { UserOrmEntity } from '~/modules/user/infrastructure/persistence/typeorm/user.orm-entity';

/**
 * Single registry of TypeORM entities for Nest and the migrations CLI.
 */
export const typeOrmEntities = [UserOrmEntity];

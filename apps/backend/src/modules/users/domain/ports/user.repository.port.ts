import type { User } from '~/modules/users/domain/entities/user.entity';

export interface CreateUserData {
  login: string;
  hashPassword: string;
}

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findByUuid(uuid: string): Promise<User | null>;
  findByLogin(login: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

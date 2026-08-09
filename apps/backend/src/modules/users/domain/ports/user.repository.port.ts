import type { RegisterRequestType } from '@repo/types';

import type { User } from '~/modules/users/domain/entities/user.entity';

export type CreateUserData = Pick<RegisterRequestType, 'login' | 'fullName'> & {
  hashPassword: string;
  email?: string | null;
};

export type UpdateProfileData = {
  fullName?: string;
  email?: string;
};

export interface IUserRepository {
  count(): Promise<number>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByLogin(login: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  updateOrgId(userId: string, orgId: string): Promise<User>;
  updateLoginAt(userId: string, loginAt: Date): Promise<User>;
  updateActive(userId: string, active: boolean): Promise<User>;
  updateProfile(userId: string, data: UpdateProfileData): Promise<User>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

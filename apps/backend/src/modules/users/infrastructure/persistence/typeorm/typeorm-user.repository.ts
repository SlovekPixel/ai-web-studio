import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Organization } from '~/modules/organizations/domain/entities/organization.entity';
import { OrganizationOrmEntity } from '~/modules/organizations/infrastructure/persistence/typeorm/organization.orm-entity';
import { User } from '~/modules/users/domain/entities/user.entity';
import type {
  CreateUserData,
  IUserRepository,
  OrganizationMemberCounts,
  UpdateProfileData,
} from '~/modules/users/domain/ports/user.repository.port';
import { UserOrmEntity } from '~/modules/users/infrastructure/persistence/typeorm/user.orm-entity';

const EMPTY_COUNTS: OrganizationMemberCounts = { all: 0, active: 0 };

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly usersRepository: Repository<UserOrmEntity>,
  ) {}

  count(): Promise<number> {
    return this.usersRepository.count();
  }

  async countByOrgId(orgId: string): Promise<OrganizationMemberCounts> {
    const counts = await this.countByOrgIds([orgId]);
    return counts.get(orgId) ?? EMPTY_COUNTS;
  }

  async countByOrgIds(
    orgIds: string[],
  ): Promise<Map<string, OrganizationMemberCounts>> {
    const uniqueOrgIds = [...new Set(orgIds.filter(Boolean))];
    const result = new Map<string, OrganizationMemberCounts>(
      uniqueOrgIds.map((orgId) => [orgId, { ...EMPTY_COUNTS }]),
    );

    if (uniqueOrgIds.length === 0) {
      return result;
    }

    const rows = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.organization', 'organization')
      .select('organization.uuid', 'orgId')
      .addSelect('COUNT(*)::int', 'all')
      .addSelect(
        'COALESCE(SUM(CASE WHEN user.active = true THEN 1 ELSE 0 END), 0)::int',
        'active',
      )
      .where('organization.uuid IN (:...orgIds)', { orgIds: uniqueOrgIds })
      .groupBy('organization.uuid')
      .getRawMany<{ orgId: string; all: string; active: string }>();

    for (const row of rows) {
      result.set(row.orgId, {
        all: Number(row.all),
        active: Number(row.active),
      });
    }

    return result;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.usersRepository.find({
      relations: { organization: true },
      order: { createdAt: 'ASC' },
    });

    return this.toDomainList(entities);
  }

  async findByOrgId(orgId: string): Promise<User[]> {
    const entities = await this.usersRepository.find({
      where: { organization: { uuid: orgId } },
      relations: { organization: true },
      order: { active: 'DESC', createdAt: 'ASC' },
    });

    return this.toDomainList(entities);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.usersRepository.findOne({
      where: { id },
      relations: { organization: true },
    });

    return entity ? this.toDomainOne(entity) : null;
  }

  async findByLogin(login: string): Promise<User | null> {
    const entity = await this.usersRepository.findOne({
      where: { login },
      relations: { organization: true },
    });

    return entity ? this.toDomainOne(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.usersRepository.findOne({
      where: { email },
      relations: { organization: true },
    });

    return entity ? this.toDomainOne(entity) : null;
  }

  async create(data: CreateUserData): Promise<User> {
    const entity = UserOrmEntity.fromCreate(data);
    const saved = await this.usersRepository.save(entity);

    return saved.toDomain();
  }

  async updateOrgId(userId: string, orgId: string): Promise<User> {
    const entity = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!entity) {
      throw new Error(`User ${userId} not found before org assignment`);
    }

    entity.organization = { uuid: orgId } as OrganizationOrmEntity;
    await this.usersRepository.save(entity);

    const updated = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { organization: true },
    });

    if (!updated) {
      throw new Error(`User ${userId} not found after org assignment`);
    }

    return this.toDomainOne(updated);
  }

  async updateLoginAt(userId: string, loginAt: Date): Promise<User> {
    await this.usersRepository.update({ id: userId }, { loginAt });

    const entity = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { organization: true },
    });

    if (!entity) {
      throw new Error(`User ${userId} not found after login_at update`);
    }

    return this.toDomainOne(entity);
  }

  async updateActive(userId: string, active: boolean): Promise<User> {
    await this.usersRepository.update({ id: userId }, { active });

    const entity = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { organization: true },
    });

    if (!entity) {
      throw new Error(`User ${userId} not found after active update`);
    }

    return this.toDomainOne(entity);
  }

  async updateProfile(userId: string, data: UpdateProfileData): Promise<User> {
    await this.usersRepository.update({ id: userId }, data);

    const entity = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { organization: true },
    });

    if (!entity) {
      throw new Error(`User ${userId} not found after profile update`);
    }

    return this.toDomainOne(entity);
  }

  async updatePassword(userId: string, hashPassword: string): Promise<User> {
    await this.usersRepository.update({ id: userId }, { hashPassword });

    const entity = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { organization: true },
    });

    if (!entity) {
      throw new Error(`User ${userId} not found after password update`);
    }

    return this.toDomainOne(entity);
  }

  private async toDomainOne(entity: UserOrmEntity): Promise<User> {
    const users = await this.toDomainList([entity]);
    const user = users[0];

    if (!user) {
      throw new Error(`Failed to map user ${entity.id}`);
    }

    return user;
  }

  private async toDomainList(entities: UserOrmEntity[]): Promise<User[]> {
    const orgIds = entities
      .map((entity) => entity.orgId ?? entity.organization?.uuid)
      .filter((orgId): orgId is string => Boolean(orgId));
    const countsByOrgId = await this.countByOrgIds(orgIds);

    return entities.map((entity) => {
      const orgId = entity.orgId ?? entity.organization?.uuid ?? null;
      const organization = this.mapOrganization(
        entity.organization,
        orgId ? (countsByOrgId.get(orgId) ?? EMPTY_COUNTS) : EMPTY_COUNTS,
      );

      return new User(
        entity.id,
        entity.login,
        entity.hashPassword,
        entity.email,
        entity.fullName,
        entity.active,
        orgId,
        organization,
        entity.loginAt,
        entity.createdAt,
        entity.updatedAt,
      );
    });
  }

  private mapOrganization(
    organization: OrganizationOrmEntity | null,
    counts: OrganizationMemberCounts,
  ): Organization | null {
    if (!organization) {
      return null;
    }

    return organization.toDomain(counts);
  }
}

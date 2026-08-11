import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Organization } from '~/modules/organizations/domain/entities/organization.entity';
import type {
  CreateOrganizationData,
  IOrganizationRepository,
  UpdateOrganizationData,
} from '~/modules/organizations/domain/ports/organization.repository.port';
import { OrganizationOrmEntity } from '~/modules/organizations/infrastructure/persistence/typeorm/organization.orm-entity';
import {
  USER_REPOSITORY,
  type IUserRepository,
  type OrganizationMemberCounts,
} from '~/modules/users/domain/ports/user.repository.port';

const EMPTY_COUNTS: OrganizationMemberCounts = { all: 0, active: 0 };

@Injectable()
export class TypeOrmOrganizationRepository implements IOrganizationRepository {
  constructor(
    @InjectRepository(OrganizationOrmEntity)
    private readonly organizationsRepository: Repository<OrganizationOrmEntity>,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<Organization[]> {
    const entities = await this.organizationsRepository.find({
      order: { createdAt: 'ASC' },
    });

    return this.toDomainList(entities);
  }

  async findByUuid(uuid: string): Promise<Organization | null> {
    const entity = await this.organizationsRepository.findOne({
      where: { uuid },
    });

    return entity ? this.toDomainOne(entity) : null;
  }

  async findByName(name: string): Promise<Organization | null> {
    const entity = await this.organizationsRepository.findOne({
      where: { name },
    });

    return entity ? this.toDomainOne(entity) : null;
  }

  async findByInn(inn: string): Promise<Organization | null> {
    const entity = await this.organizationsRepository.findOne({
      where: { inn },
    });

    return entity ? this.toDomainOne(entity) : null;
  }

  async create(data: CreateOrganizationData): Promise<Organization> {
    const entity = OrganizationOrmEntity.fromCreate(data);
    const saved = await this.organizationsRepository.save(entity);

    return this.toDomainOne(saved);
  }

  async update(
    uuid: string,
    data: UpdateOrganizationData,
  ): Promise<Organization> {
    await this.organizationsRepository.update({ uuid }, data);

    const entity = await this.organizationsRepository.findOne({
      where: { uuid },
    });

    if (!entity) {
      throw new Error(`Organization ${uuid} not found after update`);
    }

    return this.toDomainOne(entity);
  }

  private async toDomainOne(
    entity: OrganizationOrmEntity,
  ): Promise<Organization> {
    const organizations = await this.toDomainList([entity]);
    const organization = organizations[0];

    if (!organization) {
      throw new Error(`Failed to map organization ${entity.uuid}`);
    }

    return organization;
  }

  private async toDomainList(
    entities: OrganizationOrmEntity[],
  ): Promise<Organization[]> {
    const countsByOrgId = await this.userRepository.countByOrgIds(
      entities.map((entity) => entity.uuid),
    );

    return entities.map((entity) =>
      entity.toDomain(countsByOrgId.get(entity.uuid) ?? EMPTY_COUNTS),
    );
  }
}

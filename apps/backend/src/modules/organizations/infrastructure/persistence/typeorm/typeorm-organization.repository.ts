import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Organization } from '~/modules/organizations/domain/entities/organization.entity';
import type {
  CreateOrganizationData,
  IOrganizationRepository,
  UpdateOrganizationData,
} from '~/modules/organizations/domain/ports/organization.repository.port';
import { OrganizationOrmEntity } from '~/modules/organizations/infrastructure/persistence/typeorm/organization.orm-entity';

@Injectable()
export class TypeOrmOrganizationRepository implements IOrganizationRepository {
  constructor(
    @InjectRepository(OrganizationOrmEntity)
    private readonly organizationsRepository: Repository<OrganizationOrmEntity>,
  ) {}

  async findAll(): Promise<Organization[]> {
    const entities = await this.organizationsRepository.find({
      order: { createdAt: 'ASC' },
    });

    return entities.map((entity) => entity.toDomain());
  }

  async findByUuid(uuid: string): Promise<Organization | null> {
    const entity = await this.organizationsRepository.findOne({
      where: { uuid },
    });

    return entity ? entity.toDomain() : null;
  }

  async findByName(name: string): Promise<Organization | null> {
    const entity = await this.organizationsRepository.findOne({
      where: { name },
    });

    return entity ? entity.toDomain() : null;
  }

  async findByInn(inn: string): Promise<Organization | null> {
    const entity = await this.organizationsRepository.findOne({
      where: { inn },
    });

    return entity ? entity.toDomain() : null;
  }

  async create(data: CreateOrganizationData): Promise<Organization> {
    const entity = OrganizationOrmEntity.fromCreate(data);
    const saved = await this.organizationsRepository.save(entity);

    return saved.toDomain();
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

    return entity.toDomain();
  }
}

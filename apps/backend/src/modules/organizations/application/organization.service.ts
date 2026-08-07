import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import type { PublicOrganization } from '~/modules/organizations/domain/entities/organization.entity';
import {
  ORGANIZATION_REPOSITORY,
  type CreateOrganizationData,
  type IOrganizationRepository,
  type UpdateOrganizationData,
} from '~/modules/organizations/domain/ports/organization.repository.port';
import { UserService } from '~/modules/users/application/user.service';
import type { PublicUser } from '~/modules/users/domain/entities/user.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    private readonly userService: UserService,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async findAll(): Promise<PublicOrganization[]> {
    const organizations = await this.organizationRepository.findAll();

    return organizations.map((organization) => organization.toPublic());
  }

  async findByUuid(uuid: string): Promise<PublicOrganization> {
    const organization = await this.organizationRepository.findByUuid(uuid);

    if (!organization) {
      throw new NotFoundException(
        this.i18nService.translate('ERRORS.ORGANIZATION_NOT_FOUND', {
          organizationUuid: uuid,
        }),
      );
    }

    return organization.toPublic();
  }

  async create(data: CreateOrganizationData): Promise<PublicOrganization> {
    await this.userService.findById(data.ownerId);

    const existingByName = await this.organizationRepository.findByName(
      data.name,
    );

    if (existingByName) {
      throw new ConflictException(
        this.i18nService.translate('ERRORS.ORGANIZATION_NAME_TAKEN', {
          name: data.name,
        }),
      );
    }

    if (data.inn) {
      const existingByInn = await this.organizationRepository.findByInn(
        data.inn,
      );

      if (existingByInn) {
        throw new ConflictException(
          this.i18nService.translate('ERRORS.ORGANIZATION_INN_TAKEN', {
            inn: data.inn,
          }),
        );
      }
    }

    const organization = await this.organizationRepository.create(data);
    await this.userService.assignOrganization(data.ownerId, organization.uuid);

    return organization.toPublic();
  }

  async update(
    uuid: string,
    data: UpdateOrganizationData,
  ): Promise<PublicOrganization> {
    const organization = await this.organizationRepository.findByUuid(uuid);

    if (!organization) {
      throw new NotFoundException(
        this.i18nService.translate('ERRORS.ORGANIZATION_NOT_FOUND', {
          organizationUuid: uuid,
        }),
      );
    }

    if (data.name !== undefined && data.name !== organization.name) {
      const existingByName = await this.organizationRepository.findByName(
        data.name,
      );

      if (existingByName) {
        throw new ConflictException(
          this.i18nService.translate('ERRORS.ORGANIZATION_NAME_TAKEN', {
            name: data.name,
          }),
        );
      }
    }

    const updated = await this.organizationRepository.update(uuid, data);

    return updated.toPublic();
  }

  async addUser(organizationUuid: string, userId: string): Promise<PublicUser> {
    await this.findByUuid(organizationUuid);
    await this.userService.findById(userId);

    const user = await this.userService.assignOrganization(
      userId,
      organizationUuid,
    );

    return user.toPublic();
  }
}

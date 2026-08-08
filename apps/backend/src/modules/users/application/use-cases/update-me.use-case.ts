import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { PublicUserType, UpdateMeRequestType } from '@repo/types';

import {
  I18N_SERVICE,
  type II18nService,
} from '~/core/i18n/domain/ports/i18n.service.port';
import {
  USER_REPOSITORY,
  type IUserRepository,
  type UpdateProfileData,
} from '~/modules/users/domain/ports/user.repository.port';

@Injectable()
export class UpdateMeUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(I18N_SERVICE)
    private readonly i18nService: II18nService,
  ) {}

  async execute(
    userId: string,
    data: UpdateMeRequestType,
  ): Promise<PublicUserType> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(
        this.i18nService.translate('ERRORS.USER_NOT_FOUND', {
          userId,
        }),
      );
    }

    const updateData: UpdateProfileData = {};

    if (data.fullName !== undefined) {
      updateData.fullName = data.fullName;
    }

    if (data.email !== undefined) {
      if (user.email !== null) {
        if (data.email !== user.email) {
          throw new BadRequestException(
            this.i18nService.translate('ERRORS.EMAIL_ALREADY_SET'),
          );
        }
      } else {
        const existingByEmail = await this.userRepository.findByEmail(
          data.email,
        );

        if (existingByEmail && existingByEmail.id !== user.id) {
          throw new ConflictException(
            this.i18nService.translate('ERRORS.EMAIL_ALREADY_TAKEN', {
              email: data.email,
            }),
          );
        }

        updateData.email = data.email;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return user.toPublic();
    }

    const updated = await this.userRepository.updateProfile(userId, updateData);

    return updated.toPublic();
  }
}

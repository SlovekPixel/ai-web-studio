import type { TranslationKey } from '~/core/i18n/domain/types/translation-key.type';

export interface II18nService {
  translate(
    key: TranslationKey,
    ...args: Array<string | Record<string, unknown>>
  ): string;
}

export const I18N_SERVICE = Symbol('I18N_SERVICE');

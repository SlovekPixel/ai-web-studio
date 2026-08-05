import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import format from 'string-format';

import en from '~/assets/locales/en.json';
import ru from '~/assets/locales/ru.json';
import {
  DEFAULT_LOCALE,
  type LocaleRequestPayload,
} from '~/core/i18n/domain/constants/locales';
import type { II18nService } from '~/core/i18n/domain/ports/i18n.service.port';
import type {
  LocaleMessages,
  TranslationKey,
} from '~/core/i18n/domain/types/translation-key.type';

@Injectable({ scope: Scope.REQUEST, durable: true })
export class I18nService implements II18nService {
  private readonly locales: Record<string, LocaleMessages> = { ru, en };

  constructor(
    @Inject(REQUEST) private readonly payload: LocaleRequestPayload,
  ) {}

  translate(
    key: TranslationKey,
    ...args: Array<string | Record<string, unknown>>
  ): string {
    const localeCode = this.payload.localeCode ?? DEFAULT_LOCALE;
    const locale = this.locales[localeCode];

    if (!locale) {
      throw new Error(`Locale ${localeCode} not found`);
    }

    const text = this.resolveTranslation(locale, key);

    return format(text, ...args);
  }

  private resolveTranslation(
    messages: LocaleMessages,
    key: TranslationKey,
  ): string {
    const value = key.split('.').reduce<unknown>((current, segment) => {
      if (
        current !== null &&
        typeof current === 'object' &&
        segment in current
      ) {
        return (current as Record<string, unknown>)[segment];
      }

      return undefined;
    }, messages);

    if (typeof value !== 'string') {
      throw new Error(`Translation key "${key}" not found or is not a string`);
    }

    return value;
  }
}

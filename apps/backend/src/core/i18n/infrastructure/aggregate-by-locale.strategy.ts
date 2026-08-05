import {
  type ContextId,
  ContextIdFactory,
  type ContextIdResolver,
  type ContextIdResolverFn,
  type ContextIdStrategy,
  type HostComponentInfo,
} from '@nestjs/core';
import { pick } from 'accept-language-parser';
import type { Request } from 'express';

import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from '~/core/i18n/domain/constants/locales';

export class AggregateByLocaleContextIdStrategy implements ContextIdStrategy {
  private readonly locales = new Map<string, ContextId>();

  attach(
    contextId: ContextId,
    request: Request,
  ): ContextIdResolverFn | ContextIdResolver {
    const acceptLanguage = request.headers['accept-language'];
    const header = Array.isArray(acceptLanguage)
      ? acceptLanguage.join(',')
      : acceptLanguage;

    const localeCode =
      (header ? pick([...SUPPORTED_LOCALES], header) : null) ?? DEFAULT_LOCALE;

    let localeSubTreeId = this.locales.get(localeCode);

    if (!localeSubTreeId) {
      localeSubTreeId = ContextIdFactory.create();
      this.locales.set(localeCode, localeSubTreeId);
      setTimeout(() => this.locales.delete(localeCode), 3000);
    }

    return {
      payload: { localeCode },
      resolve: (info: HostComponentInfo) =>
        info.isTreeDurable ? localeSubTreeId : contextId,
    };
  }
}

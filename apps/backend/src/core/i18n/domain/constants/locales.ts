export const DEFAULT_LOCALE = 'ru' as const;

export const SUPPORTED_LOCALES = ['ru', 'en'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export interface LocaleRequestPayload {
  readonly localeCode: string;
}

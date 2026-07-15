import { z } from 'zod';
import ru from 'zod/v4/locales/ru.js';

export function i18nZod() {
  z.config(ru());
}
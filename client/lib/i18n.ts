// lib/i18n.ts
import { createI18n } from 'next-international';

export const {
  useI18n,
  useScopedI18n,
  I18nProvider,
  useChangeLocale,
  useCurrentLocale,
  getLocaleProps
} = createI18n({
  en: () => import('../locales/en.json'),
  pt: () => import('../locales/pt.json'),
  de: () => import('../locales/de.json'),
  fr: () => import('../locales/fr.json'),
  ru: () => import('../locales/ru.json')
});
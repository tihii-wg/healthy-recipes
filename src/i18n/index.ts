import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { en } from './locales/en'
import { ro } from './locales/ro'
import { ru } from './locales/ru'

export const supportedLanguages = ['en', 'ro', 'ru'] as const

export type AppLanguage = (typeof supportedLanguages)[number]

export const languages: { code: AppLanguage }[] = [
  { code: 'en' },
  { code: 'ro' },
  { code: 'ru' },
]

export function normalizeLanguage(language: string | undefined): AppLanguage {
  const base = (language ?? 'en').split('-')[0]?.toLowerCase() ?? 'en'
  return (supportedLanguages as readonly string[]).includes(base) ? (base as AppLanguage) : 'en'
}

function syncDocumentLanguage(language: string) {
  document.documentElement.lang = normalizeLanguage(language)
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ro: { translation: ro },
      ru: { translation: ru },
    },
    fallbackLng: 'en',
    supportedLngs: [...supportedLanguages],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })
  .then(() => {
    syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language)
  })

i18n.on('languageChanged', syncDocumentLanguage)

export default i18n

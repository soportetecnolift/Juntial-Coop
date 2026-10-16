import { es } from './es'
import { en } from './en'
import { fr } from './fr'
import { ca } from './ca'
import { showcase } from './showcase'

export const dictionaries = {
  es: { ...es, showcase: showcase.es },
  en: { ...en, showcase: showcase.en },
  fr: { ...fr, showcase: showcase.fr },
  ca: { ...ca, showcase: showcase.ca },
}

export const supportedLanguages = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ca', label: 'Català' },
]

export const defaultLanguage = 'es'

import { es } from './es'
import { en } from './en'
import { fr } from './fr'
import { ca } from './ca'
import { showcase } from './showcase'
import { liveLab } from './liveLab'

export const dictionaries = {
  es: { ...es, showcase: showcase.es, liveLab: liveLab.es },
  en: { ...en, showcase: showcase.en, liveLab: liveLab.en },
  fr: { ...fr, showcase: showcase.fr, liveLab: liveLab.fr },
  ca: { ...ca, showcase: showcase.ca, liveLab: liveLab.ca },
}

export const supportedLanguages = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ca', label: 'Català' },
]

export const defaultLanguage = 'es'

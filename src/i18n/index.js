import { es } from './es'
import { en } from './en'
import { fr } from './fr'
import { ca } from './ca'

export const dictionaries = { es, en, fr, ca }

export const supportedLanguages = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ca', label: 'Català' },
]

export const defaultLanguage = 'es'

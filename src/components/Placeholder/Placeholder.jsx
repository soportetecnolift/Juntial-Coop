import { useLanguage } from '../../context/LanguageContext'
import './Placeholder.css'

const ICONS = {
  video: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
      <rect x="2.5" y="5.5" width="14" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16.5 10l5-3v10l-5-3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  photo: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.5" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 16l5-4.5 4 3.5 4-5 5.5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  process: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
      <rect x="2.5" y="3.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="15.5" y="14.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 6.5h4a3 3 0 013 3v6a3 3 0 003 3" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2.6 2.6" />
    </svg>
  ),
}

const LABEL_KEY = {
  video: 'common.videoPlaceholder',
  photo: 'common.photoPlaceholder',
  process: 'common.processPlaceholder',
}

/**
 * Bloque de marcador de posición para contenido multimedia pendiente
 * de subir por el cliente (vídeo, foto o ilustración de proceso).
 * type: 'video' | 'photo' | 'process'
 * ratio: proporción aspect-ratio CSS, ej. '16/9', '4/3', '1/1'
 */
export default function Placeholder({ type = 'photo', ratio = '16/9', label, className = '' }) {
  const { t } = useLanguage()
  const text = label || t(LABEL_KEY[type])

  return (
    <div className={`ph-block ${className}`} style={{ aspectRatio: ratio }}>
      <div className="ph-block__icon">{ICONS[type]}</div>
      <div className="ph-block__label">{text}</div>
      <div className="ph-block__hint">{t('common.uploadHint')}</div>
    </div>
  )
}

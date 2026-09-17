import { useEffect, useState } from 'react'
import { LogoMark } from '../Logo/Logo'
import './Splash.css'

const DISPLAY_MS = 1600
const FADE_MS = 500

/**
 * El splash debe verse en cada carga real del documento (primera visita
 * o F5/recarga), pero nunca al navegar entre páginas dentro de la SPA
 * (React Router cambia el contenido sin recargar el documento, así que
 * ese caso ni siquiera vuelve a montar este componente).
 *
 * sessionStorage no sirve para distinguir esto: persiste igual en una
 * recarga que en una navegación SPA, ambas dentro de la misma pestaña.
 * La señal correcta es la Navigation Timing API, que indica el tipo real
 * de carga del documento ('reload', 'navigate' o 'back_forward').
 */
export function shouldShowSplash() {
  if (typeof window === 'undefined' || typeof performance === 'undefined') return true

  const [entry] = performance.getEntriesByType?.('navigation') || []
  const navType = entry?.type

  // 'navigate' = primera entrada a la URL, 'reload' = F5 o recarga del navegador.
  // 'back_forward' (botones atrás/adelante) se trata igual que una recarga.
  if (navType === 'navigate' || navType === 'reload' || navType === 'back_forward') {
    return true
  }

  // Fallback para navegadores sin soporte de la API: mostrar siempre.
  return true
}

export default function Splash({ onFinish }) {
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), DISPLAY_MS)
    const finishTimer = setTimeout(() => onFinish?.(), DISPLAY_MS + FADE_MS)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(finishTimer)
    }
  }, [onFinish])

  return (
    <div className={`splash${fadingOut ? ' splash--fade' : ''}`} role="status" aria-label="Cargando Juntial">
      <div className="splash__mark">
        <LogoMark size={72} />
      </div>
      <div className="splash__wordmark">
        JUNT<span>IAL</span>
      </div>
      <div className="splash__bar">
        <div className="splash__bar-fill" />
      </div>
    </div>
  )
}

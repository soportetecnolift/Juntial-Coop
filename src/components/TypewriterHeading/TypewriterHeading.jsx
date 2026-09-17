import { useEffect, useMemo, useState } from 'react'

/**
 * Titular que se escribe carácter a carácter, como si una IA lo redactara
 * en vivo, en lugar de aparecer de golpe.
 *
 * Dos modos de uso:
 *  - Texto simple: <TypewriterHeading text="Casos de uso reales" />
 *  - Con acento coloreado a mitad de frase (para el Hero de Home):
 *    <TypewriterHeading before="Conectamos tu empresa" accent="con la
 *    inteligencia" after="que la mueve" />
 *    El tramo `accent` mantiene su propio color mientras se escribe junto
 *    con el resto, sin que aparezcan huecos ni palabras pegadas: se escribe
 *    cortando directamente sobre el string completo, no recomponiendo desde
 *    fragmentos sueltos.
 *
 * Se reinicia limpiamente cada vez que cambia el idioma si el consumidor le
 * da un `key` (React desmonta y vuelve a montar), y respeta
 * prefers-reduced-motion mostrando el texto completo de inmediato.
 */
export default function TypewriterHeading({
  text,
  before = '',
  accent = '',
  after = '',
  as: Tag = 'h1',
  accentClassName = 'accent',
  speed = 18,
  startDelay = 150,
  className,
}) {
  const hasAccent = accent.length > 0
  const resolvedBefore = hasAccent ? before : (text || '')

  const full = useMemo(
    () => (hasAccent ? `${resolvedBefore} ${accent} ${after}` : resolvedBefore),
    [hasAccent, resolvedBefore, accent, after]
  )

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const [count, setCount] = useState(() => (prefersReducedMotion ? full.length : 0))

  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    // Arranca el bucle de animación (requestAnimationFrame es el "sistema
    // externo" que este efecto sincroniza); el 0 inicial es el punto de
    // partida del conteo, no un valor derivable en render.
    setCount(0)
    let raf
    let startTime
    let started = false

    const totalChars = full.length

    function tick(now) {
      if (!started) {
        if (startTime === undefined) startTime = now
        if (now - startTime < startDelay) {
          raf = requestAnimationFrame(tick)
          return
        }
        started = true
        startTime = now
      }
      const elapsed = now - startTime
      const next = Math.min(totalChars, Math.floor(elapsed / speed))
      setCount(next)
      if (next < totalChars) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [full, speed, startDelay, prefersReducedMotion])

  const done = count >= full.length
  const caret = (
    <span className={`typewriter-caret${done ? ' typewriter-caret--done' : ''}`} aria-hidden="true" />
  )

  if (!hasAccent) {
    // Modo texto simple: sin tramos que colorear, se corta directo.
    const visible = full.slice(0, count)
    return (
      <Tag className={className}>
        {visible}
        {caret}
      </Tag>
    )
  }

  // Modo con acento: corta sobre `full` completo (no sobre los fragmentos
  // por separado) para que los espacios entre tramos nunca se dupliquen ni
  // se pierdan mientras se está escribiendo a mitad de un tramo.
  const beforeLen = resolvedBefore.length
  const accentStart = beforeLen + 1
  const accentEnd = accentStart + accent.length
  const afterStart = accentEnd + 1

  const typed = full.slice(0, count)
  const visibleBefore = typed.slice(0, Math.min(count, beforeLen))
  const visibleAccent = typed.slice(Math.min(count, accentStart), Math.min(count, accentEnd))
  const visibleAfter = typed.slice(Math.min(count, afterStart))

  return (
    <Tag className={className}>
      {visibleBefore}
      {visibleBefore.length === beforeLen && count > beforeLen && ' '}
      {visibleAccent.length > 0 && <span className={accentClassName}>{visibleAccent}</span>}
      {visibleAccent.length === accent.length && count > accentEnd && ' '}
      {visibleAfter}
      {caret}
    </Tag>
  )
}

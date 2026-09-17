import { useEffect, useRef, useState } from 'react'

/**
 * Detecta cuándo un elemento entra en el viewport para dispararle una
 * animación de aparición (fade + desplazamiento) una sola vez, en vez de
 * mostrar toda la página de golpe al cargar. Usa IntersectionObserver, no
 * listeners de scroll manuales, para no afectar el rendimiento.
 *
 * Respeta prefers-reduced-motion: si está activo, marca el elemento como
 * "visible" de inmediato, sin observarlo, porque animar movimiento cuando
 * el usuario lo ha pedido explícitamente desactivado sería ignorar su
 * preferencia de accesibilidad.
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px 0px -80px 0px' } = {}) {
  const ref = useRef(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const [visible, setVisible] = useState(prefersReducedMotion)

  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect() // se revela una vez, no repite al salir/entrar
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin, prefersReducedMotion])

  return [ref, visible]
}

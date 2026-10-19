import { useCallback, useEffect, useState } from 'react'

/**
 * Reloj de reproducción: `t` (ms) avanza mientras `active` sea true y no se llegue al final
 * (o en bucle). Se actualiza a ~35 fps: suficiente para el efecto y barato para React.
 * Todo lo demás (pintar, pausar, saltar) es función de `t`.
 */
export default function usePlayer(total, { loop = false, active = true, start = 0 } = {}) {
  const [t, setT] = useState(start)
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const running = playing && active && (loop || t < total)

  useEffect(() => {
    if (!running) return undefined
    let raf = 0
    let last = performance.now()
    let acc = 0
    const tick = (now) => {
      acc += now - last
      last = now
      if (acc >= 28) {
        const step = acc * speed
        acc = 0
        setT((prev) => {
          const next = prev + step
          if (next >= total) return loop ? next - total : total
          return next
        })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, speed, total, loop])

  const restart = useCallback((from = 0) => {
    setT(from)
    setPlaying(true)
  }, [])
  const toggle = useCallback(() => setPlaying((p) => !p), [])
  const seek = useCallback((ms) => setT(Math.max(0, Math.min(total, ms))), [total])

  return { t, playing: running, speed, setSpeed, restart, toggle, seek, finished: !loop && t >= total }
}

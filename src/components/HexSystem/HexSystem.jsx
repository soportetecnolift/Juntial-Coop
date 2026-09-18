import { useEffect, useRef, useState, useCallback } from 'react'
import './HexSystem.css'

const MAX_PARTICLES = 70
const SPAWN_INTERVAL_MS = 45
const BURST_COUNT = 18 // partículas extra disparadas de golpe al entrar el cursor

let particleId = 0

/**
 * El sistema hexagonal del Hero: reacciona al cursor con varias capas de
 * efecto pensadas para causar impacto visual real, no solo un matiz sutil:
 *
 *  1. Ráfaga inicial: al ENTRAR el cursor, una explosión de partículas
 *     sale disparada de golpe (no goteando), junto con un doble anillo de
 *     choque y varios rayos lineales — el momento de mayor impacto.
 *  2. Goteo continuo: mientras el cursor sigue encima, nuevas chispas
 *     siguen naciendo a ritmo constante, más grandes y brillantes que en
 *     la v1.
 *  3. Tilt 3D + rebote de escala: el hexágono sigue al cursor en 3D y da
 *     un pequeño salto de escala en el instante de entrada.
 *  4. Todo se intensifica mientras el hover está activo: brillo, anillos
 *     en azul, rotación acelerada.
 *
 * Se desactiva con prefers-reduced-motion y en dispositivos táctiles.
 */
export default function HexSystem() {
  const containerRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const [particles, setParticles] = useState([])
  const spawnTimer = useRef(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const noHover =
    typeof window !== 'undefined' && window.matchMedia?.('(hover: none)').matches
  const effectsEnabled = !prefersReducedMotion && !noHover

  const addParticle = useCallback((overrides = {}) => {
    const angle = Math.random() * Math.PI * 2
    const distance = 110 + Math.random() * 110
    const size = 4 + Math.random() * 6
    const duration = 650 + Math.random() * 550

    const id = particleId++
    const particle = {
      id,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      size,
      duration,
      ...overrides,
    }

    setParticles((prev) => {
      const next = [...prev, particle]
      return next.length > MAX_PARTICLES ? next.slice(next.length - MAX_PARTICLES) : next
    })

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id))
    }, particle.duration)
  }, [])

  const fireBurst = useCallback(() => {
    // Ráfaga instantánea: varias partículas a la vez, repartidas en
    // ángulos regulares (no aleatorios) para que se note como una
    // explosión radial simétrica, no un goteo disperso.
    for (let i = 0; i < BURST_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / BURST_COUNT + Math.random() * 0.3
      const distance = 130 + Math.random() * 90
      addParticle({
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        size: 5 + Math.random() * 5,
        duration: 550 + Math.random() * 350,
      })
    }
  }, [addParticle])

  useEffect(() => {
    if (!hovering || !effectsEnabled) {
      clearInterval(spawnTimer.current)
      return
    }
    spawnTimer.current = setInterval(() => addParticle(), SPAWN_INTERVAL_MS)
    return () => clearInterval(spawnTimer.current)
  }, [hovering, effectsEnabled, addParticle])

  function handleMouseEnter() {
    if (!effectsEnabled) return
    setHovering(true)
    setBurstKey((k) => k + 1) // remonta el shockwave, disparándolo de nuevo
    fireBurst()
  }

  function handleMouseLeave() {
    setHovering(false)
    setTilt({ x: 0, y: 0 })
  }

  function handleMouseMove(e) {
    if (!effectsEnabled) return
    const node = containerRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: px, y: py })
  }

  const rayCount = 8

  return (
    <div
      ref={containerRef}
      className={`hex-system${hovering ? ' is-hovering' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="hex-system__ambient-glow" aria-hidden="true" />

      <div
        className="hex-system__tilt"
        style={{
          transform: effectsEnabled
            ? `rotateX(${tilt.y * -16}deg) rotateY(${tilt.x * 16}deg)`
            : undefined,
        }}
      >
        <div className="facet-system">
          <div className="orbit-line o1" />
          <div className="orbit-line o2" />
          <div className="node n1" />
          <div className="node n2" />
          <div className="node n3" />
          <div className="facet f1" />
          <div className="facet f2" />
          <div className="facet f3" />
        </div>
      </div>

      {effectsEnabled && burstKey > 0 && (
        <div key={burstKey} className="hex-system__burst" aria-hidden="true">
          <span className="hex-system__shockwave hex-system__shockwave--1" />
          <span className="hex-system__shockwave hex-system__shockwave--2" />
          <span className="hex-system__flash" />
          {Array.from({ length: rayCount }).map((_, i) => (
            <span
              key={i}
              className="hex-system__ray"
              style={{ '--angle': `${(360 / rayCount) * i}deg` }}
            />
          ))}
        </div>
      )}

      <div className="hex-system__particles" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className="hex-system__particle"
            style={{
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
              '--size': `${p.size}px`,
              '--duration': `${p.duration}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

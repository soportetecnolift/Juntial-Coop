import { useScrollReveal } from '../../hooks/useScrollReveal'

/**
 * Envuelve cualquier bloque para que aparezca con un fade + desplazamiento
 * sutil cuando entra en el viewport, en vez de estar visible desde el
 * primer render. `delay` (ms) permite escalonar varios Reveal contiguos
 * (por ejemplo, las tarjetas de una misma grilla) para que no aparezcan
 * todas en el mismo instante.
 */
export default function Reveal({ children, as: Tag = 'div', delay = 0, className = '' }) {
  const [ref, visible] = useScrollReveal()

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? ' reveal--visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

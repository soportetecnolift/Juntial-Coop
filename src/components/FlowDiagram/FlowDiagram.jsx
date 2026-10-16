import './FlowDiagram.css'

const SVG_PROPS = {
  viewBox: '0 0 24 24',
  width: 20,
  height: 20,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const ICONS = {
  trigger: <path d="M13 3L5 13.2h6L10 21l8-10.2h-6L13 3z" />,
  step: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21M5.6 5.6l1.9 1.9M16.5 16.5l1.9 1.9M5.6 18.4l1.9-1.9M16.5 7.5l1.9-1.9" />
    </>
  ),
  guard: <path d="M12 3l7 3v5.5c0 4.2-2.9 7.6-7 9.5-4.1-1.9-7-5.3-7-9.5V6l7-3zM9 12l2.2 2.2L15.5 10" />,
  ai: <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />,
  system: (
    <>
      <ellipse cx="12" cy="6.5" rx="7" ry="2.8" />
      <path d="M5 6.5v11c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-11M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" />
    </>
  ),
  output: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  human: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
    </>
  ),
}

/**
 * Flujo animado paso a paso: un "pulso" recorre los nodos y los conectores
 * en bucle, como si el dato viajara por el sistema. Es HTML/CSS (texto real:
 * seleccionable, traducible, accesible) y se reordena en vertical cuando el
 * contenedor es estrecho (container query), sin depender del viewport.
 */
export default function FlowDiagram({ nodes, kinds, label }) {
  return (
    <div className="flow-wrap">
      <ol className="flow" style={{ '--n': nodes.length }} aria-label={label}>
        {nodes.map((node, i) => {
          const kind = kinds[i] || 'step'
          return (
            <li className={`flow__item flow__item--${kind}`} style={{ '--i': i }} key={i}>
              <div className="flow__node">
                <span className="flow__icon">
                  <svg {...SVG_PROPS}>{ICONS[kind]}</svg>
                </span>
                <span className="flow__text">
                  <span className="flow__label">{node.label}</span>
                  {node.sub && <span className="flow__sub">{node.sub}</span>}
                </span>
              </div>
              {i < nodes.length - 1 && (
                <span className="flow__link" aria-hidden="true">
                  <span className="flow__dot" />
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

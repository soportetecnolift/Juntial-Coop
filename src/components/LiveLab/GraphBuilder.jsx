import { useId } from 'react'
import { clamp, easeOutBack, easeOutCubic, cursorAt, controlAnchor } from './timeline'
import './GraphBuilder.css'

// Glifos sencillos (caja 24x24) en colores de marca aproximados: sugieren cada herramienta
// sin reproducir sus logotipos.
const APPS = {
  gmail: { color: '#EA4335', glyph: <path d="M4 18V7l8 6 8-6v11" /> },
  drive: { color: '#F4B400', glyph: <path d="M12 5l7.5 13h-15z" fill="#fff" stroke="none" /> },
  claude: { color: '#D4A27F', glyph: <path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7" stroke="#3B2A1F" strokeWidth="2.2" /> },
  router: {
    color: '#6EBE44',
    glyph: (
      <>
        <circle cx="12" cy="12" r="3.2" fill="#fff" stroke="none" />
        <path d="M14 10l4-4M14.5 6H18v3.5M14 14l4 4M14.5 18H18v-3.5M10 12H5.5" />
      </>
    ),
  },
  tools: { color: '#A78BFA', glyph: <path d="M12 15V6M8.5 9.5L12 6l3.5 3.5M5 14v4h14v-4" /> },
  http: {
    color: '#0B84F3',
    glyph: (
      <>
        <circle cx="12" cy="12" r="7.5" />
        <path d="M4.5 12h15M12 4.5c3 3.2 3 11.8 0 15M12 4.5c-3 3.2-3 11.8 0 15" />
      </>
    ),
  },
  webhook: {
    color: '#D6336C',
    glyph: (
      <>
        <circle cx="12" cy="7.5" r="2.2" />
        <circle cx="7" cy="16.5" r="2.2" />
        <circle cx="17" cy="16.5" r="2.2" />
        <path d="M11 9.4l-3 5.3M13 9.4l3 5.3M9.4 16.5h5.2" />
      </>
    ),
  },
  zohocrm: { color: '#4A90E2', glyph: <path d="M10.5 13.5a3 3 0 0 1 0-4.2l2-2a3 3 0 0 1 4.2 4.2l-1 1M13.5 10.5a3 3 0 0 1 0 4.2l-2 2a3 3 0 0 1-4.2-4.2l1-1" /> },
  workdrive: { color: '#1F5FA8', glyph: <path d="M4 8h6l2 2h8v8H4z" /> },
  json: { color: '#A98CE8', glyph: <text x="12" y="16" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#fff" stroke="none">{'{ }'}</text> },
  telegram: { color: '#2AABEE', glyph: <path d="M20.5 4.5L3.5 11l5.5 2 2 5.5 2.7-3.7 4.3 3z" fill="#fff" stroke="none" /> },
  mcp: { color: '#15171C', glyph: <path d="M9 4v4M15 4v4M7 8h10v3.5a5 5 0 0 1-10 0zM12 16.5V20" /> },
  agent: { color: '#7C3AED', glyph: <path d="M12 3.5l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2z" fill="#fff" stroke="none" /> },
  respond: { color: '#4A8AF4', glyph: <path d="M4.5 13l3 3 6.5-7.5M10.5 15.5l2 2 7-8" /> },
  delay: {
    color: '#8A93A6',
    glyph: (
      <>
        <circle cx="12" cy="12" r="7.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
  },
  decision: {
    color: '#0EA5A4',
    glyph: (
      <>
        <circle cx="7" cy="6" r="1.6" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="8" r="1.6" />
        <path d="M7 7.6v8.8M7 12h6a4 4 0 0 0 4-4v-.4" />
      </>
    ),
  },
  email: {
    color: '#5B6B8C',
    glyph: (
      <>
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="M4.5 7.5l7.5 5.5 7.5-5.5" />
      </>
    ),
  },
}

function Glyph({ app, size = 24 }) {
  const a = APPS[app] ?? APPS.tools
  return (
    <g
      transform={`translate(${-size / 2} ${-size / 2}) scale(${size / 24})`}
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {a.glyph}
    </g>
  )
}

const RADIUS = 30
const flowRect = (n) => ({ x: n.x, y: n.y, w: n.w ?? 262, h: n.h ?? 54, type: n.type })

const quadAt = (a, c, b, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]]
const cubicAt = (a, c1, c2, b, t) => {
  const u = 1 - t
  return [u ** 3 * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t ** 3 * b[0], u ** 3 * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t ** 3 * b[1]]
}

function makeGeometry(e, A, B) {
  const LABEL_T = 0.6 // las etiquetas van más cerca del destino para no tapar el módulo de origen
  if (e.radial) {
    const mx = (A.x + B.x) / 2
    const my = (A.y + B.y) / 2
    const c = [mx - (B.y - A.y) * 0.07, my + (B.x - A.x) * 0.07]
    return { d: `M${A.x} ${A.y} Q${c[0]} ${c[1]} ${B.x} ${B.y}`, mid: quadAt([A.x, A.y], c, [B.x, B.y], LABEL_T) }
  }
  const dx = (B.x - A.x) * 0.5
  const c1 = [A.x + dx, A.y]
  const c2 = [B.x - dx, B.y]
  return { d: `M${A.x} ${A.y} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${B.x} ${B.y}`, mid: cubicAt([A.x, A.y], c1, c2, [B.x, B.y], LABEL_T) }
}

function flowGeometry(e, A, B) {
  const mode = e.mode ?? 'v'
  if (mode === 'v') {
    const x1 = A.x + A.w / 2
    const y1 = A.y + A.h
    const x2 = B.x + B.w / 2
    const y2 = B.y
    if (x1 === x2) return { d: `M${x1} ${y1} V${y2}`, end: [x2, y2], mid: [x1, (y1 + y2) / 2] }
    const my = (y1 + y2) / 2
    return { d: `M${x1} ${y1} V${my} H${x2} V${y2}`, end: [x2, y2], mid: [(x1 + x2) / 2, my] }
  }
  if (mode === 'hv') {
    const x1 = A.x + A.w
    const y1 = A.y + (A.type === 'decision' ? 56 : A.h / 2)
    const x2 = B.x + B.w / 2
    return { d: `M${x1} ${y1} H${x2} V${B.y}`, end: [x2, B.y], mid: [(x1 + x2) / 2, y1] }
  }
  const x1 = A.x + A.w
  const y1 = A.y + A.h / 2
  const x2 = B.x + B.w / 2
  const xo = x1 + 40
  const ym = B.y - 22
  return { d: `M${x1} ${y1} H${xo} V${ym} H${x2} V${B.y}`, end: [x2, B.y], mid: [xo, (y1 + ym) / 2] }
}

function Edge({ e, geo, color, t, tl, uid, skin, W, H, paused }) {
  const p = clamp((t - e.start) / e.dur)
  if (p <= 0) return null
  const isErr = e.kind === 'error'
  const col = isErr ? '#E5484D' : color
  const run = tl.runs.find((r) => r.i === e.i)
  const rp = run ? clamp((t - run.start) / run.dur) : 0
  const maskId = `${uid}m${e.i}`
  const lw = e.label ? e.label.length * 5.4 + 16 : 0
  return (
    <g>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
        <path d={geo.d} stroke="#fff" strokeWidth="18" fill="none" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - p} />
      </mask>
      {skin === 'make' ? (
        <path
          d={geo.d}
          fill="none"
          stroke={col}
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeDasharray="0.1 9"
          opacity="0.85"
          mask={`url(#${maskId})`}
          className={`gb__dots${paused ? ' is-paused' : ''}`}
        />
      ) : (
        <path d={geo.d} fill="none" stroke={col} strokeWidth="1.8" strokeLinejoin="round" mask={`url(#${maskId})`} />
      )}
      {skin === 'flow' && p >= 1 && geo.end && (
        <path d={`M${geo.end[0] - 5} ${geo.end[1] - 9} L${geo.end[0]} ${geo.end[1]} L${geo.end[0] + 5} ${geo.end[1] - 9}z`} fill={col} />
      )}
      {run && rp > 0 && rp < 1 && (
        <path
          d={geo.d}
          pathLength="1"
          fill="none"
          stroke="#7C3AED"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="0.08 2"
          strokeDashoffset={0.08 - rp * 1.08}
        />
      )}
      {e.label && p >= 1 && (
        <g transform={`translate(${geo.mid[0]} ${geo.mid[1]})`}>
          <rect x={-lw / 2} y="-9" width={lw} height="18" rx="9" fill="#fff" stroke="#d6dae4" />
          <text textAnchor="middle" y="3.8" className="gb__chip">{e.label}</text>
        </g>
      )}
    </g>
  )
}

function MakeNode({ node, t, appear }) {
  const k = clamp((t - appear) / 380)
  if (k <= 0) return null
  const app = APPS[node.app] ?? APPS.tools
  const r = node.r ?? RADIUS
  const rp = clamp((t - appear) / 650)
  const lw = node.label.length * 7.1
  const nw = String(node.n ?? '').length * 6 + 8
  return (
    <g transform={`translate(${node.x} ${node.y})`}>
      <circle r={r * (1 + rp * 1.5)} fill="none" stroke={app.color} strokeWidth={3 * (1 - rp)} opacity={1 - rp} />
      <g transform={`scale(${easeOutBack(k)})`} opacity={clamp((t - appear) / 160)}>
        <circle r={r + 5} fill="#fff" filter="url(#gb-shadow)" />
        <circle r={r} fill={app.color} />
        <Glyph app={node.app} size={r * 0.82} />
        <text y={r + 20} textAnchor="middle" className="gb__label">{node.label}</text>
        <text y={r + 33} textAnchor="middle" className="gb__sub">{node.sub}</text>
        {node.n != null && (
          <g>
            <rect x={lw / 2 + 4} y={r + 9.5} width={nw} height="13" rx="3" fill="#e4e7ee" />
            <text x={lw / 2 + 4 + nw / 2} y={r + 19} textAnchor="middle" className="gb__num">{node.n}</text>
          </g>
        )}
      </g>
    </g>
  )
}

function FlowNode({ node, t, appear, labels }) {
  const k = clamp((t - appear) / 380)
  if (k <= 0) return null
  const g = flowRect(node)
  const app = APPS[node.app] ?? APPS.tools
  const title = node.type === 'delay' ? labels.delay : node.type === 'email' ? labels.sendEmail : node.title
  const dy = (1 - easeOutCubic(k)) * -14
  const isDecision = node.type === 'decision'
  return (
    <g transform={`translate(${g.x} ${g.y + dy})`} opacity={clamp((t - appear) / 220)}>
      <rect width={g.w} height={g.h} rx="6" fill="#fff" stroke="#dde1ea" filter="url(#gb-shadow-sm)" />
      <rect width="4" height={g.h} rx="2" fill="#3B82F6" />
      {isDecision ? (
        <>
          <g transform="translate(28 23)">
            <circle r="13" fill={APPS.decision.color} />
            <Glyph app="decision" size={15} />
          </g>
          <text x="52" y="28" className="gb__ftitle">{labels.decision}</text>
          <rect x="14" y="46" width={g.w - 28} height="22" rx="4" fill="#f2f5fa" stroke="#e1e6ef" />
          <text x="22" y="61" className="gb__fcond">{labels[node.cond]}</text>
          <text x={g.w / 2} y="84" textAnchor="middle" className="gb__fdef">{labels.defaultValue}</text>
        </>
      ) : (
        <>
          <g transform={`translate(28 ${g.h / 2})`}>
            <circle r="13" fill={app.color} />
            <Glyph app={node.app} size={15} />
          </g>
          <text x="52" y={g.h / 2 + 4.5} className="gb__ftitle">{title}</text>
        </>
      )}
      {node.tag && (
        <g transform="translate(4 -18)">
          <rect width={labels[node.tag].length * 5.6 + 12} height="15" fill="#fff" stroke="#dde1ea" />
          <text x="6" y="10.8" className="gb__ftag">{labels[node.tag]}</text>
        </g>
      )}
      {node.errorOut && (
        <g>
          <circle cx={g.w} cy={g.h / 2} r="4.5" fill="#fff" stroke="#E5484D" strokeWidth="1.8" />
          <text x={g.w + 9} y={g.h / 2 - 8} className="gb__ferr">{labels.onError}</text>
        </g>
      )}
    </g>
  )
}

function Cursor({ c }) {
  return (
    <g transform={`translate(${c.x} ${c.y})`} opacity={c.o} filter="url(#gb-shadow-sm)">
      <path d="M0 0L0 17 4.6 13 7.6 20 10.2 18.8 7.2 12 13 12z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </g>
  )
}

export default function GraphBuilder({ demo, timeline: tl, t, labels, ui, playing }) {
  const uid = useId().replace(/:/g, '')
  const { w: W, h: H, skin } = demo
  const isFlow = skin === 'flow'
  const done = t >= tl.clickAt
  const cur = cursorAt(tl, t)
  const ctrl = controlAnchor(demo)
  const press = t >= tl.clickAt - 40 && t < tl.clickAt + 160
  const bw = 62 + ui.runOnce.length * 7.4

  return (
    <div className={`gb gb--${skin}`}>
      <div className="gb__scroll">
        <svg className="gb__svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={demo.id}>
          <defs>
            <filter id="gb-shadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1c2230" floodOpacity="0.2" />
            </filter>
            <filter id="gb-shadow-sm" x="-20%" y="-20%" width="140%" height="160%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#1c2230" floodOpacity="0.14" />
            </filter>
            <pattern id={`${uid}g`} width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.1" fill={isFlow ? '#cfd4de' : '#d4d8e0'} />
            </pattern>
          </defs>

          <rect width={W} height={H} fill={isFlow ? '#f8f9fc' : '#f4f5f7'} />
          <rect width={W} height={H} fill={`url(#${uid}g)`} />

          <g>
            {tl.edges.map((e) => {
              const A = tl.byId[e.from]
              const B = tl.byId[e.to]
              const geo = isFlow ? flowGeometry(e, flowRect(A), flowRect(B)) : makeGeometry(e, A, B)
              const color = isFlow ? '#98A2B3' : APPS[A.app]?.color ?? '#999'
              return <Edge key={e.i} e={e} geo={geo} color={color} t={t} tl={tl} uid={uid} skin={skin} W={W} H={H} paused={!playing} />
            })}
          </g>

          <g>
            {tl.order.map((id) => {
              const n = tl.byId[id]
              return isFlow ? (
                <FlowNode key={id} node={n} t={t} appear={tl.appear[id]} labels={labels} />
              ) : (
                <MakeNode key={id} node={n} t={t} appear={tl.appear[id]} />
              )
            })}
          </g>

          {isFlow ? (
            <g transform="translate(18 10)">
              <rect width="104" height="28" rx="14" fill={done ? '#e6f6ec' : '#eceef3'} stroke={done ? '#a8dcbb' : '#d9dde6'} />
              <circle cx="15" cy="14" r="4.2" fill={done ? '#16A34A' : '#9AA1B0'} />
              <text x="27" y="18.2" className="gb__status">{done ? ui.active : ui.draft}</text>
            </g>
          ) : (
            <g transform={`translate(${ctrl.x} ${ctrl.y}) scale(${press ? 0.95 : 1})`} opacity={t >= tl.builtAt ? 1 : 0.45}>
              <rect x={-bw / 2} y="-19" width={bw} height="38" rx="19" fill="#7C3AED" filter="url(#gb-shadow)" />
              <path d={`M${-bw / 2 + 18} -6.5l10.5 6.5-10.5 6.5z`} fill="#fff" />
              <text x={-bw / 2 + 40} y="4.6" className="gb__btn">{ui.runOnce}</text>
              {t >= tl.clickAt && t < tl.clickAt + 650 && (
                <circle r={22 + (t - tl.clickAt) / 5} fill="none" stroke="#7C3AED" strokeWidth="2" opacity={1 - (t - tl.clickAt) / 650} />
              )}
            </g>
          )}

          <Cursor c={cur} />
        </svg>
      </div>
    </div>
  )
}

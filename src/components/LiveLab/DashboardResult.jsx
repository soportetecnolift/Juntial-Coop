import { clamp, easeOutCubic } from './timeline'

// Datos 100 % ficticios. [ingresos, gasto, rentabilidad] como % de altura.
const BARS = [
  [62, 50, 12], [48, 41, 7], [80, 66, 14], [35, 31, 4], [92, 74, 18], [55, 47, 8],
  [70, 58, 12], [44, 38, 6], [86, 70, 16], [58, 49, 9], [66, 54, 12], [74, 60, 14],
]
const ROWS = [
  [1, 'A', 4200, 'paid'],
  [2, 'B', 1850, 'pending'],
  [3, 'C', 6320, 'paid'],
  [4, 'A', 980, 'pending'],
]
const KPIS = [
  { key: 'revenue', value: 1284500, color: '#38C9A8' },
  { key: 'costs', value: 1051200, color: '#E5606F' },
  { key: 'profit', value: 233300, color: '#1AB5D8' },
]
const MARGIN = 18.2
const SCALE_MAX = 40

function arc(cx, cy, r, s0, s1) {
  const pt = (s) => {
    const a = ((180 + 180 * s) * Math.PI) / 180
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  }
  const [x0, y0] = pt(s0)
  const [x1, y1] = pt(s1)
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
}

export default function DashboardResult({ p, labels, lang }) {
  const fmt = (n) => `${Math.round(n).toLocaleString(lang)} €`
  const gauge = easeOutCubic(clamp((p - 0.3) / 0.35))
  const needle = 180 + 180 * (MARGIN / SCALE_MAX) * gauge

  return (
    <div className="dr">
      <div className="dr__title">{labels.panel}</div>

      <div className="dr__tiles">
        {KPIS.map((k, i) => (
          <div className="dr__tile" style={{ background: k.color }} key={k.key}>
            <span>{labels[k.key]}</span>
            <b>{fmt(k.value * easeOutCubic(clamp((p - 0.04 - i * 0.07) / 0.4)))}</b>
          </div>
        ))}
      </div>

      <div className="dr__row">
        <div className="dr__panel dr__panel--chart">
          <svg viewBox="0 0 300 112" role="img" aria-label={labels.panel}>
            <line x1="0" y1="104" x2="300" y2="104" stroke="#e4e7ee" />
            {BARS.map((b, g) => {
              const grow = easeOutCubic(clamp((p - 0.12 - g * 0.025) / 0.3))
              const x0 = 8 + g * 24
              return (
                <g key={g}>
                  <rect x={x0} y={104 - b[0] * 0.95 * grow} width="6" height={b[0] * 0.95 * grow} fill="#38C9A8" />
                  <rect x={x0 + 7} y={104 - b[1] * 0.95 * grow} width="6" height={b[1] * 0.95 * grow} fill="#E5606F" />
                  <rect x={x0 + 14} y={104 - b[2] * 0.95 * grow} width="5" height={b[2] * 0.95 * grow} fill="#3F85BE" />
                </g>
              )
            })}
          </svg>
        </div>

        <div className="dr__panel dr__panel--gauge">
          <svg viewBox="0 0 160 96" role="img" aria-label={labels.margin}>
            <path d={arc(80, 82, 60, 0, 0.25)} stroke="#E5606F" strokeWidth="16" fill="none" />
            <path d={arc(80, 82, 60, 0.25, 0.5)} stroke="#FFC107" strokeWidth="16" fill="none" />
            <path d={arc(80, 82, 60, 0.5, 1)} stroke="#17D17F" strokeWidth="16" fill="none" />
            <g transform={`rotate(${needle} 80 82)`}>
              <line x1="80" y1="82" x2="132" y2="82" stroke="#2b2f3a" strokeWidth="2.6" strokeLinecap="round" />
              <circle cx="80" cy="82" r="4.5" fill="#2b2f3a" />
            </g>
            <text x="80" y="94" textAnchor="middle" className="dr__gauge-n">{(MARGIN * gauge).toFixed(1)}%</text>
          </svg>
          <div className="dr__gauge-l">{labels.margin}</div>
        </div>
      </div>

      <table className="dr__table">
        <thead>
          <tr>
            <th>{labels.project}</th>
            <th>{labels.supplier}</th>
            <th>{labels.amount}</th>
            <th>{labels.status}</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => {
            const o = clamp((p - 0.55 - i * 0.07) / 0.1)
            return (
              <tr key={i} style={{ opacity: o, transform: `translateY(${(1 - o) * 6}px)` }}>
                <td>{labels.project} 0{r[0]}</td>
                <td>{labels.supplier} {r[1]}</td>
                <td>{fmt(r[2])}</td>
                <td><i className={`dr__pill dr__pill--${r[3]}`}>{labels[r[3]]}</i></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

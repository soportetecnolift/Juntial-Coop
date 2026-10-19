import { clamp, easeOutCubic } from './timeline'

// Aplicación de leads que aparece al final de la demo MERN. Datos ficticios.
const SEED = [
  ['Luis Martín', 'qualified'],
  ['Marta Ruiz', 'new'],
  ['Carlos Gil', 'won'],
]
const NEW_NAME = 'Ana Torres'
const NEW_EMAIL = 'ana@example.com'

export default function BrowserResult({ p }) {
  const nameN = Math.floor(clamp((p - 0.22) / 0.14) * NEW_NAME.length)
  const mailN = Math.floor(clamp((p - 0.37) / 0.16) * NEW_EMAIL.length)
  const added = p >= 0.62
  const press = p >= 0.55 && p < 0.62

  return (
    <div className="br">
      <div className="br__bar">
        <span className="br__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="br__url">localhost:5173</span>
      </div>
      <div className="br__app" style={{ opacity: easeOutCubic(clamp(p / 0.12)) }}>
        <h4>Leads</h4>
        <div className="br__form">
          <span className="br__input">
            {NEW_NAME.slice(0, added ? 0 : nameN) || <em>Name</em>}
          </span>
          <span className="br__input">
            {NEW_EMAIL.slice(0, added ? 0 : mailN) || <em>Email</em>}
          </span>
          <span className={`br__btn${press ? ' is-press' : ''}`}>Add</span>
        </div>
        <ul className="br__list">
          {added && (
            <li className="is-new" style={{ opacity: clamp((p - 0.62) / 0.08) }}>
              <b>{NEW_NAME}</b>
              <i className="dr__pill dr__pill--new">new</i>
            </li>
          )}
          {SEED.map((s, i) => (
            <li key={s[0]} style={{ opacity: clamp((p - 0.04 - i * 0.05) / 0.08) }}>
              <b>{s[0]}</b>
              <i className={`dr__pill dr__pill--${s[1]}`}>{s[1]}</i>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

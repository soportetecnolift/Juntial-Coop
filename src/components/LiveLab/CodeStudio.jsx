import { useEffect, useMemo, useRef, useState } from 'react'
import { tokenizeCode, sliceTokens } from '../../lib/highlight'
import { codeStateAt } from './timeline'
import DashboardResult from './DashboardResult'
import BrowserResult from './BrowserResult'
import './CodeStudio.css'

const baseName = (p) => p.split('/').pop()

function buildTree(paths) {
  const root = { name: '', children: new Map(), file: null }
  for (const p of paths) {
    let node = root
    const parts = p.split('/')
    parts.forEach((part, i) => {
      if (!node.children.has(part)) node.children.set(part, { name: part, children: new Map(), file: null })
      node = node.children.get(part)
      if (i === parts.length - 1) node.file = p
    })
  }
  return root
}

function TreeNode({ node, depth, activePath, fresh }) {
  const entries = [...node.children.values()].sort(
    (a, b) => (a.file ? 1 : 0) - (b.file ? 1 : 0) || a.name.localeCompare(b.name)
  )
  return entries.map((n) => (
    <div key={n.name}>
      <div
        className={`cs__node ${n.file ? 'is-file' : 'is-dir'}${n.file && n.file === activePath ? ' is-active' : ''}${
          n.file && fresh.has(n.file) ? ' is-new' : ''
        }`}
        style={{ paddingLeft: 12 + depth * 14 }}
      >
        <span className="cs__ico">{n.file ? '▫' : '▾'}</span>
        {n.name}
      </div>
      {!n.file && <TreeNode node={n} depth={depth + 1} activePath={activePath} fresh={fresh} />}
    </div>
  ))
}

function Editor({ code, lang, typed, typing, follow }) {
  const tokens = useMemo(() => tokenizeCode(code, lang), [code, lang])
  const starts = useMemo(() => {
    const out = []
    let acc = 0
    for (const line of code.split('\n')) {
      out.push(acc)
      acc += line.length + 1
    }
    return out
  }, [code])
  const box = useRef(null)

  useEffect(() => {
    if (follow && box.current) box.current.scrollTop = box.current.scrollHeight
  }, [typed, follow])

  let cur = 0
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] <= typed) cur = i
    else break
  }
  const rows = []
  for (let i = 0; i <= cur; i++) {
    const toks = i < cur ? tokens[i] : sliceTokens(tokens[i], typed - starts[i])
    rows.push(
      <div className="cs__line" key={i}>
        {toks.map((tk, j) => (
          <span key={j} className={`tok tok--${tk.type}`}>{tk.text}</span>
        ))}
        {i === cur && typing && <span className="cs__caret" />}
      </div>
    )
  }
  return (
    <div className="cs__code" ref={box}>
      {rows}
    </div>
  )
}

function Terminal({ lines }) {
  const box = useRef(null)
  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight
  })
  return (
    <div className="cs__term" ref={box}>
      {lines.map((l, i) => {
        if (l.kind === 'out') {
          return (
            <div className={`cs__tline cs__tline--${l.tone ?? 'dim'}`} key={i}>
              {l.text}
            </div>
          )
        }
        const [head, ...rest] = l.text.split(' ')
        return (
          <div className="cs__tline" key={i}>
            <span className="cs__prompt">❯</span> <span className="tok tok--fn">{head}</span>
            {rest.length > 0 ? ` ${rest.join(' ')}` : ''}
            {l.typing && <span className="cs__caret" />}
          </div>
        )
      })}
    </div>
  )
}

export default function CodeStudio({ demo, timeline: tl, t, ui, analytics, lang }) {
  const st = codeStateAt(tl, t)
  const finished = t >= tl.total - 1
  const [picked, setPicked] = useState(null)

  const shownPath = finished && picked ? picked : st.activePath
  const shown = shownPath ? tl.files[shownPath] : null
  const state = st.started.filter((f) => f.path === shownPath).pop()
  const manual = finished && picked
  const typed = shown ? (manual ? shown.code.length : state?.typed ?? 0) : 0
  const typing = shown && !manual && !(state?.done ?? true)

  const openPaths = [...new Set(st.started.map((f) => f.path))]
  const fresh = new Set(st.started.filter((f) => t - f.startedAt < 900).map((f) => f.path))
  const tree = useMemo(() => buildTree(openPaths), [openPaths.join('|')]) // eslint-disable-line
  const layout = demo.layout
  const hotRun = layout === 'split' && st.started.length > 0 && st.started[st.started.length - 1].done
  const showBrowser = st.result?.view === 'browser'

  return (
    <div className={`cs cs--${layout}`}>
      <div className="cs__chrome">
        <span className="cs__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="cs__title">{demo.windowTitle}</span>
        <span className="cs__chrome-sp" />
      </div>

      <div className="cs__body">
        {layout === 'ide' && (
          <aside className="cs__tree">
            <TreeNode node={tree} depth={0} activePath={shownPath} fresh={fresh} />
          </aside>
        )}

        <div className="cs__main">
          <div className="cs__tabs">
            {openPaths.map((p) => (
              <button
                type="button"
                key={p}
                className={`cs__tab${p === shownPath ? ' is-active' : ''}`}
                onClick={() => finished && setPicked(p)}
                tabIndex={finished ? 0 : -1}
              >
                {baseName(p)}
              </button>
            ))}
            {layout === 'split' && (
              <span className={`cs__run${hotRun ? ' is-hot' : ''}${st.result ? ' is-done' : ''}`}>▶ Run</span>
            )}
          </div>

          <div className="cs__editor">
            {showBrowser ? (
              <BrowserResult p={st.result.p} />
            ) : shown ? (
              <Editor code={shown.code} lang={shown.lang} typed={typed} typing={typing} follow={!manual} />
            ) : (
              <div className="cs__empty">{demo.windowTitle}</div>
            )}
          </div>

          {layout === 'editor' && st.status.length > 0 && (
            <div className="cs__status">
              {st.status.map((k) => (
                <span key={k}>{ui[k]}</span>
              ))}
            </div>
          )}
          {layout === 'ide' && <Terminal lines={st.terminal} />}
        </div>

        {layout === 'split' && (
          <div className="cs__result">
            {st.result?.view === 'dashboard' ? (
              <DashboardResult p={st.result.p} labels={analytics} lang={lang} />
            ) : (
              <div className="cs__empty cs__empty--dim">{analytics.panel}</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

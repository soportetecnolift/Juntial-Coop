// Línea de tiempo pura (sin React): todo lo que se ve en una demo es una función del
// tiempo `t` (ms). Así pausar, repetir, acelerar, saltar y grabar son triviales y exactos.
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
export const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
export const easeOutBack = (x) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

/* ------------------------------ Código escrito en vivo ------------------------------ */

/** Instante (ms) en que queda escrito cada carácter; los saltos de línea cuestan una pausa. */
export function charTimes(content, cps) {
  const base = 1000 / cps
  const times = new Float64Array(content.length + 1)
  let acc = 0
  for (let i = 0; i < content.length; i++) {
    const ch = content[i]
    acc += ch === '\n' ? base * 5 : ch === ' ' ? base * 0.55 : base
    times[i + 1] = acc
  }
  return times
}

export function typedCount(times, elapsed) {
  if (elapsed <= 0) return 0
  const n = times.length - 1
  if (elapsed >= times[n]) return n
  let lo = 0
  let hi = n
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (times[mid] <= elapsed) lo = mid
    else hi = mid - 1
  }
  return lo
}

export function buildCodeTimeline(demo) {
  const files = Object.fromEntries((demo.files || []).map((f) => [f.path, f]))
  const events = []
  let t = demo.lead ?? 500
  for (const step of demo.script) {
    if (step.type === 'cmd') {
      const dur = (step.text.length * 1000) / (step.cps ?? 45)
      const end = t + dur + (step.pause ?? 350)
      events.push({ ...step, start: t, typeEnd: t + dur, end })
      t = end
    } else if (step.type === 'out') {
      const lines = Array.isArray(step.text) ? step.text : [step.text]
      const end = t + (step.ms ?? 260)
      events.push({ ...step, lines, start: t, end })
      t = end
    } else if (step.type === 'file') {
      const times = charTimes(files[step.path].code, step.cps ?? 150)
      const dur = times[times.length - 1]
      const end = t + dur + (step.pause ?? 400)
      events.push({ ...step, times, start: t, typeEnd: t + dur, end })
      t = end
    } else {
      const end = t + (step.ms ?? (step.type === 'result' ? 5200 : 900))
      events.push({ ...step, start: t, end })
      t = end
    }
  }
  return { events, files, total: t + (demo.hold ?? 2400) }
}

export function codeStateAt(tl, t) {
  const terminal = []
  const started = []
  const status = []
  let activePath = null
  let result = null
  for (const ev of tl.events) {
    if (t < ev.start) continue
    if (ev.type === 'cmd') {
      const p = ev.typeEnd > ev.start ? clamp((t - ev.start) / (ev.typeEnd - ev.start)) : 1
      terminal.push({ kind: 'cmd', text: ev.text.slice(0, Math.floor(p * ev.text.length)), typing: p < 1 })
    } else if (ev.type === 'out') {
      for (const text of ev.lines) terminal.push({ kind: 'out', text, tone: ev.tone })
    } else if (ev.type === 'file') {
      started.push({ path: ev.path, typed: typedCount(ev.times, t - ev.start), done: t >= ev.typeEnd, startedAt: ev.start })
      activePath = ev.path
    } else if (ev.type === 'status') {
      status.push(ev.key)
    } else if (ev.type === 'result') {
      result = { view: ev.view, p: clamp((t - ev.start) / (ev.end - ev.start)) }
    }
  }
  return { terminal, started, activePath, status, result }
}

/* ------------------------------ Escenarios que se montan solos ------------------------------ */

export function nodeAnchor(spec, node) {
  if (spec.skin === 'flow') return { x: node.x + (node.w ?? 262) * 0.3, y: node.y + (node.h ?? 54) / 2 }
  return { x: node.x, y: node.y }
}
export function controlAnchor(spec) {
  if (spec.control) return spec.control
  return spec.skin === 'flow' ? { x: 70, y: 24 } : { x: spec.w / 2, y: spec.h - 32 }
}

export function buildGraphTimeline(spec) {
  const lead = spec.lead ?? 600
  const gap = spec.gap ?? 600
  const byId = Object.fromEntries(spec.nodes.map((n) => [n.id, n]))
  const order = spec.order ?? spec.nodes.map((n) => n.id)

  const appear = {}
  let t = lead
  order.forEach((id, i) => {
    if (i > 0) t += byId[id].gap ?? gap
    appear[id] = t
  })

  const edges = spec.edges.map((e, i) => ({
    ...e,
    i,
    start: Math.max(appear[e.from], appear[e.to]) + 140,
    dur: 460,
  }))
  const builtAt = Math.max(appear[order[order.length - 1]] + 700, ...edges.map((e) => e.start + e.dur))
  const clickAt = builtAt + 700
  const runStart = clickAt + 250
  const runs = edges.filter((e) => e.kind !== 'error').map((e, k) => ({ i: e.i, start: runStart + k * 130, dur: 320 }))
  const total = (runs.length ? runs[runs.length - 1].start + 320 : runStart) + 2200

  // fotogramas clave del cursor: viaja de módulo en módulo, hace clic y acaba en el botón
  const arrive = (id) => appear[id] - 70
  const first = nodeAnchor(spec, byId[order[0]])
  const keys = [{ t: arrive(order[0]) - 600, x: first.x - 170, y: first.y - 130 }]
  order.forEach((id, i) => {
    const a = nodeAnchor(spec, byId[id])
    if (i > 0) {
      const prev = nodeAnchor(spec, byId[order[i - 1]])
      const travel = Math.min(320, Math.max(120, arrive(id) - arrive(order[i - 1]) - 80))
      keys.push({ t: arrive(id) - travel, x: prev.x, y: prev.y })
    }
    keys.push({ t: arrive(id), x: a.x, y: a.y })
  })
  const last = nodeAnchor(spec, byId[order[order.length - 1]])
  const ctrl = controlAnchor(spec)
  keys.push({ t: builtAt - 100, x: last.x, y: last.y }, { t: clickAt - 60, x: ctrl.x, y: ctrl.y }, { t: total, x: ctrl.x, y: ctrl.y })

  return { appear, edges, order, builtAt, clickAt, runs, total, keys, byId }
}

export function cursorAt(tl, t) {
  const k = tl.keys
  const total = k[k.length - 1].t
  if (t < k[0].t) return { x: k[0].x, y: k[0].y, o: 0 }
  const o = Math.min(clamp((t - k[0].t) / 250), t > total - 700 ? clamp((total - t) / 700) : 1)
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i]
    const b = k[i + 1]
    if (t >= a.t && t <= b.t) {
      const still = (a.x === b.x && a.y === b.y) || b.t === a.t
      const p = still ? 1 : easeInOut((t - a.t) / (b.t - a.t))
      return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, o }
    }
  }
  const l = k[k.length - 1]
  return { x: l.x, y: l.y, o }
}

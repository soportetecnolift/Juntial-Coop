// Resaltado de sintaxis mínimo y propio (el proyecto no usa librerías externas).
// Tokeniza línea a línea: comentarios, cadenas, números, palabras clave y llamadas.
const JS_WORDS = [
  'import', 'from', 'const', 'let', 'var', 'export', 'async', 'await', 'return', 'if', 'else',
  'for', 'of', 'in', 'try', 'catch', 'break', 'new', 'function', 'default', 'true', 'false', 'null',
]

const KEYWORDS = {
  js: new Set(JS_WORDS),
  jsx: new Set(JS_WORDS),
  ts: new Set([...JS_WORDS, 'type', 'interface', 'as', 'void']),
  deluge: new Set([
    'void', 'if', 'else', 'for', 'each', 'in', 'try', 'catch', 'info', 'return', 'true', 'false',
    'null', 'invokeurl', 'url', 'type', 'parameters', 'headers', 'connection',
  ]),
  json: new Set(['true', 'false', 'null']),
  sql: new Set([
    'SELECT', 'AS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'FROM', 'INNER', 'LEFT', 'RIGHT', 'JOIN',
    'ON', 'GROUP', 'BY', 'ORDER', 'WHERE', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'IN', 'DISTINCT',
    'HAVING', 'LIMIT', 'UNION', 'ALL', 'DESC', 'ASC',
  ]),
}

const SLASH_COMMENT = /\/\/.*/y
const COMMENTS = { js: SLASH_COMMENT, jsx: SLASH_COMMENT, ts: SLASH_COMMENT, deluge: SLASH_COMMENT, sql: /--.*/y }
const STRING_PLAIN = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/y
const STRING_TPL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/y
const TPL_LANGS = new Set(['js', 'jsx', 'ts'])
const NUMBER = /\d[\d_]*(?:\.\d+)?/y
const WORD = /[A-Za-z_$][\w$]*/y
const JSX_TAG = /<\/?[A-Za-z][\w.-]*/y

export function tokenizeLine(line, lang) {
  if (lang === 'env') {
    if (line.trim().startsWith('#')) return [{ type: 'comment', text: line }]
    const eq = line.indexOf('=')
    if (eq < 0) return [{ type: 'plain', text: line }]
    return [
      { type: 'key', text: line.slice(0, eq) },
      { type: 'plain', text: '=' },
      { type: 'string', text: line.slice(eq + 1) },
    ].filter((tk) => tk.text.length > 0)
  }

  const words = KEYWORDS[lang] ?? KEYWORDS.js
  const upper = lang === 'sql'
  const out = []
  const push = (type, text) => {
    const last = out[out.length - 1]
    if (last && type === 'plain' && last.type === 'plain') last.text += text
    else out.push({ type, text })
  }

  const rules = []
  if (COMMENTS[lang]) rules.push(['comment', COMMENTS[lang]])
  rules.push(['string', TPL_LANGS.has(lang) ? STRING_TPL : STRING_PLAIN])
  if (lang === 'jsx') rules.push(['tag', JSX_TAG])
  rules.push(['number', NUMBER], ['word', WORD])

  let i = 0
  while (i < line.length) {
    let matched = false
    for (const [kind, re] of rules) {
      re.lastIndex = i
      const m = re.exec(line)
      if (!m) continue

      const text = m[0]
      let type = kind
      if (kind === 'word') {
        const next = line[i + text.length]
        if (words.has(upper ? text.toUpperCase() : text)) type = 'kw'
        else if (text === 'zoho') type = 'builtin'
        else if (next === '(') type = 'fn'
        else type = 'plain'
      } else if (kind === 'string' && lang === 'json') {
        type = /^\s*:/.test(line.slice(i + text.length)) ? 'key' : 'string'
      }

      push(type, text)
      i += text.length
      matched = true
      break
    }
    if (!matched) {
      push('plain', line[i])
      i += 1
    }
  }
  return out
}

export function tokenizeCode(code, lang) {
  return code.split('\n').map((line) => tokenizeLine(line, lang))
}

/** Recorta una línea ya tokenizada a sus primeros n caracteres (para el efecto de escritura). */
export function sliceTokens(tokens, n) {
  let left = n
  const out = []
  for (const tk of tokens) {
    if (left <= 0) break
    if (tk.text.length <= left) {
      out.push(tk)
      left -= tk.text.length
    } else {
      out.push({ ...tk, text: tk.text.slice(0, left) })
      left = 0
    }
  }
  return out
}

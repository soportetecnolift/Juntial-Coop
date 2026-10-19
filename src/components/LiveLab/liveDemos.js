// Las 10 demos del "Laboratorio en vivo". Son RECREACIONES con datos ficticios de trabajo
// real: ningún nombre de cliente, importe, ID de registro ni credencial.
// El texto visible (títulos, descripciones) vive en src/i18n/liveLab.js (4 idiomas).
import dgLead from './code/deluge-lead.dg.txt?raw'
import dgSign from './code/deluge-sign.dg.txt?raw'
import sqlProfit from './code/sql-profit.sql.txt?raw'
import nodePackage from './code/node-package.json.txt?raw'
import nodeEnv from './code/node-env.txt?raw'
import nodeApiKey from './code/node-apikey.js.txt?raw'
import nodeChat from './code/node-chat.js.txt?raw'
import nodeTelegram from './code/node-telegram.js.txt?raw'
import nodeGroups from './code/node-groups.js.txt?raw'
import nodeServer from './code/node-server.js.txt?raw'
import mcpPackage from './code/mcp-package.json.txt?raw'
import mcpEnv from './code/mcp-env.txt?raw'
import mcpServer from './code/mcp-server.ts.txt?raw'
import mernPackage from './code/mern-server-package.json.txt?raw'
import mernLead from './code/mern-lead.js.txt?raw'
import mernLeads from './code/mern-leads.js.txt?raw'
import mernIndex from './code/mern-index.js.txt?raw'
import mernApi from './code/mern-api.js.txt?raw'
import mernApp from './code/mern-app.jsx.txt?raw'

const raw = (s) => s.replace(/\s+$/, '')
const file = (path, lang, code) => ({ path, lang, code: raw(code) })

/**
 * Narración de cada demo: un audio por idioma, en public/media/narration/<idioma>/<id>.mp3.
 * Aparece bajo la demo con un botón para cambiar de idioma (solo muestra los idiomas disponibles).
 * Para añadir un idioma (fr, ca…): copia los 10 mp3 a public/media/narration/<idioma>/ con el
 * nombre del id de cada demo y añade el código a NARRATION_LANGS.
 * También se admite el formato antiguo de un solo medio: 'id': { audio: '...' } o { video: '...', poster: '...' }.
 */
export const NARRATION_LANGS = ['es', 'en']
export const NARRATION = Object.fromEntries(
  ['make-agent', 'make-docs', 'make-crm', 'flow-lead', 'deluge-lead', 'deluge-sign', 'sql-profit', 'node-api', 'mcp-server', 'mern'].map((id) => [
    id,
    Object.fromEntries(NARRATION_LANGS.map((l) => [l, { audio: `/media/narration/${l}/${id}.mp3` }])),
  ])
)

/* ------------------------------ Make ------------------------------ */

const MAKE_DOCS = {
  id: 'make-docs',
  group: 'make',
  engine: 'graph',
  skin: 'make',
  w: 1000,
  h: 600,
  gap: 560,
  control: { x: 120, y: 566 },
  nodes: [
    { id: 'watch', app: 'gmail', label: 'Gmail', sub: 'Watch emails', n: 1, x: 70, y: 290 },
    { id: 'vars', app: 'tools', label: 'Tools', sub: 'Set variables', n: 2, x: 170, y: 290 },
    { id: 'r1', app: 'router', label: 'Router', sub: 'Route by content', n: 3, x: 275, y: 290 },
    { id: 'att', app: 'gmail', label: 'Gmail', sub: 'Get attachment', n: 4, x: 395, y: 130 },
    { id: 'r2', app: 'router', label: 'Router', sub: 'File type', n: 5, x: 490, y: 130 },
    { id: 'cpdf', app: 'claude', label: 'Claude', sub: 'Analyze document', n: 6, x: 600, y: 70 },
    { id: 'dpdf', app: 'drive', label: 'Google Drive', sub: 'Upload a file', n: 7, x: 705, y: 70 },
    { id: 't1', app: 'tools', label: 'Tools', sub: 'Set variable', n: 8, x: 805, y: 70 },
    { id: 'cimg', app: 'claude', label: 'Claude', sub: 'Analyze image', n: 9, x: 600, y: 195 },
    { id: 'dimg', app: 'drive', label: 'Google Drive', sub: 'Upload a file', n: 10, x: 705, y: 195 },
    { id: 'prompt', app: 'tools', label: 'Tools', sub: 'Compose prompt', n: 11, x: 420, y: 300 },
    { id: 'cbody', app: 'claude', label: 'Claude', sub: 'Create a message', n: 12, x: 525, y: 300 },
    { id: 'http', app: 'http', label: 'HTTP', sub: 'Make a request', n: 13, x: 630, y: 300 },
    { id: 'crm', app: 'zohocrm', label: 'Zoho CRM', sub: 'Update a record', n: 14, x: 735, y: 300 },
    { id: 'log', app: 'tools', label: 'Tools', sub: 'Set variable', n: 15, x: 835, y: 300 },
    { id: 't3', app: 'tools', label: 'Tools', sub: 'Set variable', n: 16, x: 420, y: 460 },
    { id: 'r3', app: 'router', label: 'Router', sub: 'Rules', n: 17, x: 515, y: 455 },
    { id: 'lab', app: 'gmail', label: 'Gmail', sub: 'Add label', n: 18, x: 625, y: 395 },
    { id: 'rep', app: 'gmail', label: 'Gmail', sub: 'Send an email', n: 19, x: 625, y: 510 },
  ],
  edges: [
    { from: 'watch', to: 'vars' },
    { from: 'vars', to: 'r1' },
    { from: 'r1', to: 'att', label: 'has_attachment' },
    { from: 'att', to: 'r2' },
    { from: 'r2', to: 'cpdf', label: 'pdf' },
    { from: 'cpdf', to: 'dpdf' },
    { from: 'dpdf', to: 't1' },
    { from: 'r2', to: 'cimg', label: 'image' },
    { from: 'cimg', to: 'dimg' },
    { from: 'r1', to: 'prompt', label: 'has_body' },
    { from: 'prompt', to: 'cbody' },
    { from: 'cbody', to: 'http' },
    { from: 'http', to: 'crm' },
    { from: 'crm', to: 'log' },
    { from: 'r1', to: 't3', label: 'else' },
    { from: 't3', to: 'r3' },
    { from: 'r3', to: 'lab', label: 'newsletter' },
    { from: 'r3', to: 'rep', label: 'other' },
  ],
}

const TOOLS = [
  'Find deal by ID', 'Search deals', 'Create note', 'Update stage', 'Get notes',
  'Create meeting', 'Get open tasks', 'Get closed tasks', 'Get calls', 'Move to standby',
]
// Dos anillos alrededor del agente (interior y exterior), de derecha a izquierda
const TOOL_SLOTS = [
  [906, 358], [710, 370], [759, 516], [618, 425], [500, 445],
  [500, 580], [382, 425], [241, 516], [290, 370], [94, 358],
]
const toolNodes = TOOLS.map((label, i) => ({
  id: `tool${i}`,
  app: 'zohocrm',
  label,
  sub: 'Zoho CRM',
  n: 12 + i,
  x: TOOL_SLOTS[i][0],
  y: TOOL_SLOTS[i][1],
  gap: 330,
}))

const MAKE_AGENT = {
  id: 'make-agent',
  group: 'make',
  engine: 'graph',
  skin: 'make',
  w: 1000,
  h: 660,
  gap: 650,
  control: { x: 880, y: 632 },
  nodes: [
    { id: 'hook', app: 'webhook', label: 'Webhook', sub: 'Custom webhook', n: 1, x: 100, y: 215 },
    { id: 'agent', app: 'agent', label: 'Sales agent', sub: 'AI agent', n: 2, x: 500, y: 305, r: 42 },
    { id: 'mcp', app: 'mcp', label: 'MCP Client', sub: 'Tools', n: 3, x: 190, y: 150, gap: 520 },
    { id: 'tg', app: 'telegram', label: 'Telegram Bot', sub: 'Send a reply', n: 4, x: 500, y: 80, gap: 420 },
    { id: 'crm1', app: 'zohocrm', label: 'Zoho CRM', sub: 'Get a record', n: 5, x: 330, y: 115, gap: 420 },
    { id: 'crm2', app: 'zohocrm', label: 'Zoho CRM', sub: 'Search records', n: 6, x: 800, y: 150, gap: 420 },
    ...toolNodes,
  ],
  edges: [
    { from: 'hook', to: 'agent' },
    { from: 'agent', to: 'mcp', radial: true },
    { from: 'agent', to: 'tg', radial: true },
    { from: 'agent', to: 'crm1', radial: true },
    { from: 'agent', to: 'crm2', radial: true },
    ...toolNodes.map((n) => ({ from: 'agent', to: n.id, radial: true })),
  ],
}

const MAKE_CRM = {
  id: 'make-crm',
  group: 'make',
  engine: 'graph',
  skin: 'make',
  w: 1000,
  h: 560,
  gap: 640,
  nodes: [
    { id: 'hook', app: 'webhook', label: 'Webhook', sub: 'Custom webhook', n: 1, x: 90, y: 445 },
    { id: 'router', app: 'router', label: 'Router', sub: 'Validate input', n: 5, x: 235, y: 365 },
    { id: 'g1', app: 'gmail', label: 'Gmail', sub: 'Send an email', n: 13, x: 335, y: 485 },
    { id: 'wd', app: 'workdrive', label: 'Zoho WorkDrive', sub: 'Create a folder', n: 10, x: 425, y: 285 },
    { id: 'g2', app: 'gmail', label: 'Gmail', sub: 'Send an email', n: 44, x: 482, y: 378 },
    { id: 'json', app: 'json', label: 'JSON', sub: 'Parse JSON', n: 40, x: 562, y: 215 },
    { id: 'g3', app: 'gmail', label: 'Gmail', sub: 'Send an email', n: 47, x: 619, y: 308 },
    { id: 'http', app: 'http', label: 'HTTP', sub: 'Make a request', n: 17, x: 697, y: 140 },
    { id: 'g4', app: 'gmail', label: 'Gmail', sub: 'Send an email', n: 49, x: 754, y: 233 },
    { id: 'crm', app: 'zohocrm', label: 'Zoho CRM', sub: 'Update a record', n: 58, x: 850, y: 195 },
    { id: 'resp', app: 'webhook', label: 'Webhooks', sub: 'Webhook response', n: 57, x: 940, y: 245 },
  ],
  edges: [
    { from: 'hook', to: 'router' },
    { from: 'router', to: 'g1', label: 'else' },
    { from: 'router', to: 'wd', label: 'deal_id exists' },
    { from: 'wd', to: 'g2', kind: 'error', radial: true },
    { from: 'wd', to: 'json' },
    { from: 'json', to: 'g3', kind: 'error', radial: true },
    { from: 'json', to: 'http' },
    { from: 'http', to: 'g4', kind: 'error', radial: true },
    { from: 'http', to: 'crm' },
    { from: 'crm', to: 'resp' },
  ],
}

/* ------------------------------ Zoho Flow ------------------------------ */

const FLOW_LEAD = {
  id: 'flow-lead',
  group: 'flow',
  engine: 'graph',
  skin: 'flow',
  w: 1080,
  h: 700,
  gap: 520,
  nodes: [
    { id: 'newlead', type: 'trigger', app: 'zohocrm', title: 'New lead', x: 50, y: 56, h: 54, tag: 'realTime' },
    { id: 'dec1', type: 'decision', x: 50, y: 146, h: 92, cond: 'nameNotNull' },
    { id: 'dec2', type: 'decision', x: 50, y: 274, h: 92, cond: 'has34' },
    { id: 'delay', type: 'delay', app: 'delay', x: 50, y: 402, h: 54 },
    { id: 'fetch1', type: 'action', app: 'zohocrm', title: 'Fetch lead', x: 50, y: 492, h: 54 },
    { id: 'up1', type: 'action', app: 'respond', title: 'Create or update contact', x: 50, y: 582, h: 54 },
    { id: 'dec3', type: 'decision', x: 360, y: 262, h: 92, cond: 'has34' },
    { id: 'up2', type: 'action', app: 'respond', title: 'Create or update contact', x: 360, y: 392, h: 54 },
    { id: 'fetch2', type: 'action', app: 'zohocrm', title: 'Fetch lead', x: 360, y: 482, h: 54 },
    { id: 'up3', type: 'action', app: 'respond', title: 'Create or update contact', x: 360, y: 572, h: 54, errorOut: true },
    { id: 'mail2', type: 'email', app: 'email', x: 650, y: 640, h: 54 },
    { id: 'up4', type: 'action', app: 'respond', title: 'Create or update contact', x: 700, y: 372, h: 54, errorOut: true },
    { id: 'mail1', type: 'email', app: 'email', x: 750, y: 500, h: 54 },
  ],
  edges: [
    { from: 'newlead', to: 'dec1', mode: 'v' },
    { from: 'dec1', to: 'dec2', mode: 'v' },
    { from: 'dec1', to: 'dec3', mode: 'hv' },
    { from: 'dec2', to: 'delay', mode: 'v' },
    { from: 'delay', to: 'fetch1', mode: 'v' },
    { from: 'fetch1', to: 'up1', mode: 'v' },
    { from: 'dec3', to: 'up2', mode: 'v' },
    { from: 'up2', to: 'fetch2', mode: 'v' },
    { from: 'fetch2', to: 'up3', mode: 'v' },
    { from: 'dec3', to: 'up4', mode: 'hv' },
    { from: 'up3', to: 'mail2', mode: 'err', kind: 'error' },
    { from: 'up4', to: 'mail1', mode: 'err', kind: 'error' },
  ],
}

/* ------------------------------ Código escrito en vivo ------------------------------ */

const DELUGE_LEAD = {
  id: 'deluge-lead',
  group: 'deluge',
  engine: 'code',
  layout: 'editor',
  windowTitle: 'Zoho CRM · Functions',
  files: [file('functions/syncContactToLead.dg', 'deluge', dgLead)],
  script: [
    { type: 'file', path: 'functions/syncContactToLead.dg', cps: 150, pause: 700 },
    { type: 'status', key: 'syntaxOk', ms: 1000 },
    { type: 'status', key: 'testOk', ms: 1200 },
  ],
}

const DELUGE_SIGN = {
  id: 'deluge-sign',
  group: 'deluge',
  engine: 'code',
  layout: 'editor',
  windowTitle: 'Zoho CRM · Functions',
  files: [file('functions/attachSignedDocument.dg', 'deluge', dgSign)],
  script: [
    { type: 'file', path: 'functions/attachSignedDocument.dg', cps: 95, pause: 700 },
    { type: 'status', key: 'syntaxOk', ms: 1000 },
    { type: 'status', key: 'testOk', ms: 1200 },
  ],
}

const SQL_PROFIT = {
  id: 'sql-profit',
  group: 'sql',
  engine: 'code',
  layout: 'split',
  windowTitle: 'Zoho Analytics · SQL query',
  files: [file('queries/supplier_invoices_by_project.sql', 'sql', sqlProfit)],
  script: [
    { type: 'file', path: 'queries/supplier_invoices_by_project.sql', cps: 230, pause: 900 },
    { type: 'result', view: 'dashboard', ms: 7000 },
  ],
}

const NODE_API = {
  id: 'node-api',
  group: 'node',
  engine: 'code',
  layout: 'ide',
  windowTitle: 'telegram-bridge',
  files: [
    file('package.json', 'json', nodePackage),
    file('.env.example', 'env', nodeEnv),
    file('src/middleware/apiKey.js', 'js', nodeApiKey),
    file('src/models/Chat.js', 'js', nodeChat),
    file('src/services/telegram.js', 'js', nodeTelegram),
    file('src/routes/groups.js', 'js', nodeGroups),
    file('src/server.js', 'js', nodeServer),
  ],
  script: [
    { type: 'cmd', text: 'mkdir telegram-bridge && cd telegram-bridge', cps: 60 },
    { type: 'cmd', text: 'npm init -y', cps: 60 },
    { type: 'out', text: 'Wrote to package.json', tone: 'dim' },
    { type: 'cmd', text: 'npm i express helmet cors express-rate-limit mongoose telegram', cps: 75 },
    { type: 'out', text: 'added 126 packages in 7s', tone: 'dim', ms: 500 },
    { type: 'file', path: 'package.json', cps: 190, pause: 250 },
    { type: 'file', path: '.env.example', cps: 190, pause: 250 },
    { type: 'file', path: 'src/middleware/apiKey.js', cps: 200, pause: 250 },
    { type: 'file', path: 'src/models/Chat.js', cps: 200, pause: 250 },
    { type: 'file', path: 'src/services/telegram.js', cps: 210, pause: 250 },
    { type: 'file', path: 'src/routes/groups.js', cps: 210, pause: 250 },
    { type: 'file', path: 'src/server.js', cps: 210, pause: 500 },
    { type: 'cmd', text: 'npm run dev', cps: 60 },
    { type: 'out', text: ['MongoDB connected', 'API ready on http://localhost:3000'], tone: 'ok', ms: 700 },
    {
      type: 'cmd',
      text: `curl -s -X POST localhost:3000/groups -H "x-api-key: $API_KEY" -H "content-type: application/json" -d '{"dealId":"20001","title":"Deal 20001"}'`,
      cps: 110,
    },
    { type: 'out', text: '{"ok":true,"inviteLink":"https://t.me/+AbCdEfGh123"}', tone: 'ok', ms: 900 },
  ],
}

const MCP_SERVER = {
  id: 'mcp-server',
  group: 'mcp',
  engine: 'code',
  layout: 'ide',
  windowTitle: 'crm-mcp',
  files: [
    file('package.json', 'json', mcpPackage),
    file('.env.example', 'env', mcpEnv),
    file('src/server.ts', 'ts', mcpServer),
  ],
  script: [
    { type: 'cmd', text: 'mkdir crm-mcp && cd crm-mcp', cps: 60 },
    { type: 'cmd', text: 'npm init -y', cps: 60 },
    { type: 'out', text: 'Wrote to package.json', tone: 'dim' },
    { type: 'cmd', text: 'npm i @modelcontextprotocol/sdk zod express', cps: 75 },
    { type: 'cmd', text: 'npm i -D tsx typescript @types/node @types/express', cps: 75 },
    { type: 'out', text: 'added 94 packages in 6s', tone: 'dim', ms: 500 },
    { type: 'file', path: 'package.json', cps: 190, pause: 250 },
    { type: 'file', path: '.env.example', cps: 190, pause: 250 },
    { type: 'file', path: 'src/server.ts', cps: 215, pause: 600 },
    { type: 'cmd', text: 'npm run dev', cps: 60 },
    { type: 'out', text: ['MCP server on :3000/mcp · tools: search_deals'], tone: 'ok', ms: 1200 },
  ],
}

const MERN = {
  id: 'mern',
  group: 'node',
  engine: 'code',
  layout: 'ide',
  windowTitle: 'crm-mern',
  files: [
    file('server/package.json', 'json', mernPackage),
    file('server/src/models/Lead.js', 'js', mernLead),
    file('server/src/routes/leads.js', 'js', mernLeads),
    file('server/src/index.js', 'js', mernIndex),
    file('client/src/api.js', 'js', mernApi),
    file('client/src/App.jsx', 'jsx', mernApp),
  ],
  script: [
    { type: 'cmd', text: 'mkdir crm-mern && cd crm-mern', cps: 60 },
    { type: 'cmd', text: 'npm create vite@latest client -- --template react', cps: 75 },
    { type: 'out', text: ['Scaffolding project in ./client...', 'Done.'], tone: 'dim', ms: 500 },
    { type: 'cmd', text: 'mkdir server && cd server && npm init -y', cps: 70 },
    { type: 'cmd', text: 'npm i express mongoose cors jsonwebtoken', cps: 75 },
    { type: 'out', text: 'added 71 packages in 5s', tone: 'dim', ms: 500 },
    { type: 'file', path: 'server/package.json', cps: 190, pause: 250 },
    { type: 'file', path: 'server/src/models/Lead.js', cps: 210, pause: 250 },
    { type: 'file', path: 'server/src/routes/leads.js', cps: 220, pause: 250 },
    { type: 'file', path: 'server/src/index.js', cps: 220, pause: 400 },
    { type: 'cmd', text: 'npm run dev', cps: 60 },
    { type: 'out', text: 'API on :4000 · MongoDB connected', tone: 'ok', ms: 600 },
    { type: 'file', path: 'client/src/api.js', cps: 220, pause: 250 },
    { type: 'file', path: 'client/src/App.jsx', cps: 230, pause: 400 },
    { type: 'cmd', text: 'cd ../client && npm run dev', cps: 60 },
    { type: 'out', text: ['VITE ready in 312 ms', '➜  Local:   http://localhost:5173/'], tone: 'ok', ms: 700 },
    { type: 'result', view: 'browser', ms: 7600 },
  ],
}

export const LIVE_DEMOS = [
  MAKE_AGENT, MAKE_DOCS, MAKE_CRM, FLOW_LEAD,
  DELUGE_LEAD, DELUGE_SIGN, SQL_PROFIT,
  NODE_API, MCP_SERVER, MERN,
]

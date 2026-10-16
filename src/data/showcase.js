/**
 * Configuración de la sección "Evidencias técnicas".
 * El TEXTO vive en src/i18n/showcase.js (4 idiomas); aquí solo estructura.
 *
 * CÓMO AÑADIR EVIDENCIA REAL (cuando la tengas, ya anonimizada):
 *  1. Copia el archivo a public/media/real/  (ej. blueprint-demo.mp4, blueprint-1.png)
 *  2. En el item correspondiente rellena `media`:
 *       video:   { src: '/media/real/blueprint-demo.mp4', poster: '/media/real/blueprint-poster.jpg' }
 *       youtube: 'ID_DEL_VIDEO'   (alternativa: se carga solo al pulsar play)
 *       shots:   [{ src: '/media/real/blueprint-1.png', alt: 'Descripción de la captura' }]
 *  3. Cambia `status` a 'real' para que la etiqueta pase a "Caso real".
 *  Mientras `media` esté vacío, esa pestaña muestra el hueco marcado.
 *
 * kinds (icono/color de cada paso): trigger · step · guard · ai · system · output · human
 */
const emptyMedia = () => ({ video: null, youtube: null, shots: [] })

export const SHOWCASE = [
  {
    id: 'blueprint',
    status: 'demo',
    kinds: ['trigger', 'step', 'step', 'guard', 'step', 'output'],
    tags: ['Zoho CRM', 'Blueprint', 'Deluge'],
    code: {
      lang: 'deluge',
      filename: 'blueprint_after_transition.dg',
      source: `// Blueprint · After transition: "Approve proposal"
void automation.approveProposal(String dealId)
{
  deal = zoho.crm.getRecordById("Deals",dealId.toLong());
  amount = deal.get("Amount");
  if(amount == null || amount == 0)
  {
    info "Transition blocked, deal without amount: " + dealId;
  }
  else
  {
    payload = Map();
    payload.put("deal_id",dealId);
    payload.put("account",deal.get("Account_Name").get("name"));
    payload.put("amount",amount);
    response = invokeurl
    [
      url :"https://api.example.com/v1/proposals"
      type :POST
      parameters:payload.toString()
      headers:{"Content-Type":"application/json"}
      connection:"proposals_api"
    ];
    zoho.crm.updateRecord("Deals",dealId.toLong(),{"Stage":"Proposal Sent"});
    info response;
  }
}`,
    },
    media: emptyMedia(),
  },
  {
    id: 'deluge',
    status: 'demo',
    kinds: ['trigger', 'guard', 'system', 'step', 'system', 'guard'],
    tags: ['Deluge', 'invokeurl', 'Zoho CRM API'],
    code: {
      lang: 'deluge',
      filename: 'sync_customers.dg',
      source: `// Sync customers from an external API into Zoho CRM
void automation.syncCustomers()
{
  created = 0;
  pages = {1,2,3,4,5};
  for each  page in pages
  {
    try
    {
      resp = invokeurl
      [
        url :"https://api.example.com/v1/customers?page=" + page
        type :GET
        connection:"erp_api"
      ];
      for each  c in resp.get("data")
      {
        found = zoho.crm.searchRecords("Accounts","(External_ID:equals:" + c.get("id") + ")");
        if(found.size() == 0)
        {
          zoho.crm.createRecord("Accounts",{"Account_Name":c.get("name"),"External_ID":c.get("id")});
          created = created + 1;
        }
      }
    }
    catch (e)
    {
      info "Page " + page + " failed: " + e;
    }
  }
  info "Created: " + created;
}`,
    },
    media: emptyMedia(),
  },
  {
    id: 'api',
    status: 'demo',
    kinds: ['trigger', 'guard', 'guard', 'guard', 'step', 'system'],
    tags: ['Node.js', 'JWT', 'HMAC', 'Rate limiting'],
    code: {
      lang: 'js',
      filename: 'security.middleware.js',
      source: `import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'

const app = express()
app.use(helmet())
app.use(cors({ origin: ['https://app.example.com'], methods: ['GET', 'POST'] }))
app.use(rateLimit({ windowMs: 60_000, limit: 60 }))
app.use(express.json({ limit: '100kb', verify: (req, _res, buf) => { req.rawBody = buf } }))

const requireAuth = (req, res, next) => {
  try {
    const token = (req.headers.authorization ?? '').replace('Bearer ', '')
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'], audience: 'api' })
    next()
  } catch {
    res.status(401).json({ error: 'unauthorized' })
  }
}

const verifyWebhook = (req, res, next) => {
  const expected = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET).update(req.rawBody).digest('hex')
  const received = String(req.headers['x-signature'] ?? '')
  const valid = received.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected))
  return valid ? next() : res.status(401).json({ error: 'invalid signature' })
}`,
    },
    media: emptyMedia(),
  },
  {
    id: 'mcp',
    status: 'demo',
    kinds: ['ai', 'step', 'step', 'system', 'output'],
    tags: ['MCP', 'AI agents', 'Tool use'],
    code: {
      lang: 'json',
      filename: 'tools/list → crear_presupuesto',
      source: `{
  "name": "crear_presupuesto",
  "description": "Genera un presupuesto en el CRM a partir de la necesidad detectada.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "cliente_id": { "type": "string" },
      "producto": { "type": "string" },
      "cantidad": { "type": "integer", "minimum": 1 }
    },
    "required": ["cliente_id", "producto"]
  }
}`,
    },
    media: emptyMedia(),
  },
  {
    id: 'integrations',
    status: 'demo',
    kinds: ['trigger', 'step', 'system', 'output', 'output'],
    tags: ['Zoho One', 'Make', 'Webhooks'],
    code: null,
    media: emptyMedia(),
  },
  {
    id: 'make',
    status: 'demo',
    kinds: ['trigger', 'step', 'system', 'step', 'system', 'guard'],
    tags: ['Make', 'HTTP', 'Routers', 'Error handling'],
    code: null,
    media: emptyMedia(),
  },
  {
    id: 'claude',
    status: 'demo',
    kinds: ['trigger', 'ai', 'ai', 'step', 'step', 'output'],
    tags: ['Claude API', 'Tool use', 'Agents'],
    code: {
      lang: 'js',
      filename: 'agent.loop.js',
      source: `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()
const messages = [{ role: 'user', content: userMessage }]

for (let turn = 0; turn < 8; turn++) {
  const res = await client.messages.create({
    model: 'claude-sonnet-5-5',
    max_tokens: 1024,
    tools,
    messages,
  })
  messages.push({ role: 'assistant', content: res.content })
  if (res.stop_reason !== 'tool_use') break

  const results = []
  for (const block of res.content.filter((b) => b.type === 'tool_use')) {
    const output = await runTool(block.name, block.input)
    results.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(output) })
  }
  messages.push({ role: 'user', content: results })
}`,
    },
    media: emptyMedia(),
  },
  {
    id: 'ai',
    status: 'demo',
    kinds: ['trigger', 'ai', 'guard', 'human', 'system', 'output'],
    tags: ['Claude', 'Human-in-the-loop', 'Automation'],
    code: {
      lang: 'json',
      filename: 'extraction_result.json',
      source: `{
  "documento": "factura_proveedor.pdf",
  "proveedor": "Proveedor Demo S.L.",
  "importe": 1284.5,
  "iva": 21,
  "confianza": 0.97,
  "regla": "confianza >= 0.90",
  "accion": "registrar_automaticamente"
}`,
    },
    media: emptyMedia(),
  },
]

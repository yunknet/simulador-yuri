import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { migrate, pool } from "./db.js";

const PORT = Number(process.env.PORT || 3000);
const DIST_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(express.json({ limit: "10kb" }));

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// ==========================================================
// API — RODÍZIO DE ATENDIMENTO (quem está há mais tempo sem receber)
// ==========================================================

const requireDb = (_req, res, next) => {
  if (!pool) return res.status(503).json({ error: "Banco de dados não configurado" });
  next();
};

// Liveness do container (usado pelo HEALTHCHECK): só indica que o site está no ar.
// Não depende do banco — se o banco cair, o site continua com o rodízio local.
app.get("/healthz", (_req, res) => res.type("text").send("ok"));

// Diagnóstico para humanos: mostra também o estado do banco.
app.get("/api/health", async (_req, res) => {
  if (!pool) return res.json({ ok: true, database: "não configurado (rodízio local no navegador)" });
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, database: "conectado" });
  } catch {
    res.status(503).json({ ok: false, database: "indisponível" });
  }
});

// Escolhe e já reserva o próximo atendente numa única operação atômica,
// para dois cliques simultâneos não caírem no mesmo consultor.
app.get("/api/team/next", requireDb, async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      UPDATE team_members
         SET last_lead_at = NOW(), total_leads = total_leads + 1
       WHERE id = (
         SELECT id FROM team_members
          WHERE is_active = TRUE
          ORDER BY last_lead_at ASC, id ASC
          LIMIT 1
          FOR UPDATE SKIP LOCKED
       )
      RETURNING id, name, phone
    `);

    if (rows.length === 0) return res.status(404).json({ error: "Nenhum atendente ativo" });

    res.set("Cache-Control", "no-store").json({ success: true, member: rows[0] });
  } catch (err) {
    console.error("Erro no rodízio de equipe:", err.message);
    res.status(500).json({ error: "Erro interno ao consultar rodízio" });
  }
});

// Registra um lead enviado (usado quando o front está em outro domínio, via VITE_API_URL).
app.post("/api/team/dispatch", requireDb, async (req, res) => {
  const phone = String(req.body?.phone ?? "").replace(/\D/g, "").slice(0, 20);
  const clientName = String(req.body?.clientName ?? "Não informado").slice(0, 150);
  const leadType = String(req.body?.leadType ?? "simulador").slice(0, 50);
  if (!phone) return res.status(400).json({ error: "Telefone obrigatório" });

  try {
    await pool.query(
      `INSERT INTO lead_dispatches (team_member_id, client_name, phone, lead_type)
       SELECT id, $2, $1, $3 FROM team_members WHERE phone = $1 LIMIT 1`,
      [phone, clientName, leadType],
    );
    await pool.query("UPDATE team_members SET last_lead_at = NOW(), total_leads = total_leads + 1 WHERE phone = $1", [phone]);
    res.json({ success: true });
  } catch (err) {
    console.error("Erro ao registrar lead:", err.message);
    res.status(500).json({ error: "Erro ao registrar lead" });
  }
});

app.use("/api", (_req, res) => res.status(404).json({ error: "Rota não encontrada" }));

// ==========================================================
// FRONT-END (build do Vite)
// ==========================================================

app.use("/assets", express.static(path.join(DIST_DIR, "assets"), { immutable: true, maxAge: "1y" }));
app.use("/assets", (_req, res) => res.sendStatus(404));
app.use(express.static(DIST_DIR, { index: false, maxAge: "1h" }));

// Meta Pixel do Yuri. Pode ser trocado pela variável META_PIXEL_ID no Environment
// do Easypanel; META_PIXEL_ID=off desativa o Pixel.
const DEFAULT_META_PIXEL_ID = "1845894369781850";
const META_PIXEL_ID = String(process.env.META_PIXEL_ID || DEFAULT_META_PIXEL_ID).replace(/\D/g, "");

/** Código oficial do Meta Pixel (PageView), inserido no <head> da página. */
function metaPixelSnippet(pixelId) {
  if (!pixelId) return { head: "", body: "" };
  return {
    head: `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->`,
    body: `<noscript><img height="1" width="1" style="display:none" alt=""
src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
/></noscript>`,
  };
}

const pixel = metaPixelSnippet(META_PIXEL_ID);
let indexTemplate = null;

function renderIndex(req) {
  indexTemplate ??= fs.readFileSync(path.join(DIST_DIR, "index.html"), "utf8");
  // Domínio público: SITE_URL, se definido; senão o próprio domínio acessado.
  const siteUrl = (process.env.SITE_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
  return indexTemplate
    .replaceAll("__SITE_URL__", siteUrl)
    .replace("</head>", `${pixel.head}\n</head>`)
    .replace("<body>", `<body>\n${pixel.body}`);
}

// Qualquer outra rota abre o simulador (links de anúncio com UTMs, etc.).
app.get("*", (req, res) => {
  res.set("Cache-Control", "no-cache").type("html").send(renderIndex(req));
});

// ==========================================================

async function start() {
  try {
    await migrate();
    console.log(pool ? "Banco conectado e tabelas prontas." : "Sem banco configurado: o rodízio roda só no navegador.");
  } catch (err) {
    // Não derruba o site: o front cai no rodízio local se a API falhar.
    console.error("Falha ao preparar o banco:", err.message);
  }
  app.listen(PORT, () => console.log(`Simulador Yuri rodando na porta ${PORT}`));
}

start();

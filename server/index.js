import express from "express";
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

// Qualquer outra rota abre o simulador (links de anúncio com UTMs, etc.).
app.get("*", (_req, res) => {
  res.set("Cache-Control", "no-cache").sendFile(path.join(DIST_DIR, "index.html"));
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

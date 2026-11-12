import pg from "pg";

/**
 * Conexão com o PostgreSQL. Aceita DATABASE_URL (padrão do Easypanel)
 * ou as variáveis separadas DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME.
 * Sem configuração de banco, a API responde 503 e o site usa o rodízio local.
 */
function createPool() {
  if (process.env.DATABASE_URL) {
    return new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  }
  if (process.env.DB_HOST) {
    return new pg.Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      max: 5,
    });
  }
  return null;
}

export const pool = createPool();

/** Atendentes do rodízio (mesma lista de src/lib/teamRotation.ts). */
const TEAM_MEMBERS = [
  { name: "Yuri Soares", phone: "5538991118169" },
  { name: "Equipe Yuri (Norte de Minas)", phone: "5538998422719" },
];

/**
 * Cria as tabelas se não existirem e garante os atendentes cadastrados.
 * O esquema é o mesmo do site principal (server/db.sql do yuriconsorcio):
 * apontando os dois para o mesmo banco, o rodízio fica compartilhado.
 */
export async function migrate() {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS team_members (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL UNIQUE,
      last_lead_at TIMESTAMP WITH TIME ZONE DEFAULT '1970-01-01 00:00:00+00',
      total_leads INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lead_dispatches (
      id SERIAL PRIMARY KEY,
      team_member_id INTEGER REFERENCES team_members(id) ON DELETE SET NULL,
      client_name VARCHAR(150),
      phone VARCHAR(20),
      lead_type VARCHAR(50) DEFAULT 'simulador',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  for (const member of TEAM_MEMBERS) {
    // Não reativa quem foi desativado manualmente no banco.
    await pool.query("INSERT INTO team_members (name, phone) VALUES ($1, $2) ON CONFLICT (phone) DO NOTHING", [member.name, member.phone]);
  }
}

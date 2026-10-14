const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Supabase IPv4 Pooler configuration for sa-east-1
const poolerConfig = {
  host: "aws-0-sa-east-1.pooler.supabase.com",
  port: 5432,
  user: "postgres.ytjimwyvsoptplfivgdl",
  password: "sqdIrWgKVn21",
  database: "postgres",
  ssl: { rejectUnauthorized: false },
};

async function runMigrations() {
  console.log("Conectando ao banco de dados Supabase via Pooler IPv4...");
  const client = new Client(poolerConfig);

  try {
    await client.connect();
    console.log("✓ Conectado ao PostgreSQL com sucesso!");

    const migrationFiles = [
      "supabase/migrations/20261014000001_initial_schema.sql",
      "supabase/migrations/20261014000002_storage_setup.sql",
      "supabase/seed.sql",
    ];

    for (const file of migrationFiles) {
      const fullPath = path.join(__dirname, "..", file);
      if (fs.existsSync(fullPath)) {
        console.log(`\nExecutando: ${file}...`);
        const sql = fs.readFileSync(fullPath, "utf8");
        await client.query(sql);
        console.log(`✓ ${file} executado com sucesso!`);
      } else {
        console.warn(`Arquivo não encontrado: ${file}`);
      }
    }

    console.log("\n=======================================================");
    console.log("Todas as migrations e dados de seed foram aplicados com sucesso!");
    console.log("=======================================================\n");
  } catch (err) {
    console.error("Erro ao executar migration:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();

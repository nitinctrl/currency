const { Client } = require("pg")
const fs = require("fs")
const path = require("path")

async function migrate() {
  if (!process.env.POSTGRES_URL) {
    console.error("POSTGRES_URL is missing")
    return
  }

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log("Connected to database")

    const sqlPath = path.join(process.cwd(), "scripts/003_auth_security.sql")
    const sql = fs.readFileSync(sqlPath, "utf8")

    console.log("Running migration...")
    await client.query(sql)
    console.log("Migration complete!")
  } catch (err) {
    console.error("Migration failed:", err)
  } finally {
    await client.end()
  }
}

migrate()

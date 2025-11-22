import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL || "postgres://build:build@build.neondatabase.cloud/build")

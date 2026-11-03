import pg from 'pg';
let pool;
export function db() {
  if (!process.env.DB_URL) throw new Error('DB_URL is required');
  return pool ??= new pg.Pool({ connectionString: process.env.DB_URL, connectionTimeoutMillis: 5000 });
}
export async function notes() {
  await db().query(`CREATE TABLE IF NOT EXISTS notes (
    id BIGSERIAL PRIMARY KEY, body TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now()
  )`);
  return (await db().query('SELECT id, body FROM notes ORDER BY id DESC LIMIT 100')).rows;
}

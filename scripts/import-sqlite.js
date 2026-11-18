import 'dotenv/config';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { closeDb, getDb, initializeDatabase } from '../src/db/index.js';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const sqlitePath = path.join(scriptDir, '..', 'data', 'app.db');

const tables = [
  ['services', ['id', 'title', 'description', 'icon', 'image', 'order', 'is_active', 'created_at']],
  ['projects', ['id', 'title', 'description', 'image', 'status', 'location', 'year', 'is_featured', 'order', 'created_at']],
  ['team_members', ['id', 'name', 'role', 'bio', 'photo', 'email', 'phone', 'linkedin', 'order', 'is_active', 'created_at']],
  ['testimonials', ['id', 'client_name', 'client_role', 'client_company', 'photo', 'message', 'rating', 'is_active', 'created_at']],
  ['machine_hires', ['id', 'name', 'description', 'image', 'rate', 'is_available', 'order', 'created_at']],
  ['contact_messages', ['id', 'name', 'email', 'phone', 'message', 'is_read', 'created_at']],
  ['consultation_bookings', ['id', 'name', 'email', 'phone', 'service_interest', 'preferred_date', 'preferred_time', 'message', 'status', 'created_at']],
];

function quoteIdentifier(identifier) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

async function importSqliteData() {
  await access(sqlitePath);
  const source = await open({ filename: sqlitePath, driver: sqlite3.Database });
  let client;
  let transactionStarted = false;

  try {
    await initializeDatabase();
    const database = await getDb();
    client = await database.connect();
    await client.query('BEGIN');
    transactionStarted = true;

    for (const [table, columns] of tables) {
      const selectedColumns = columns.map(quoteIdentifier).join(', ');
      const rows = await source.all(`SELECT ${selectedColumns} FROM ${quoteIdentifier(table)}`);
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
      const updates = columns
        .filter(column => column !== 'id')
        .map(column => `${quoteIdentifier(column)} = EXCLUDED.${quoteIdentifier(column)}`)
        .join(', ');
      const insert = `
        INSERT INTO ${quoteIdentifier(table)} (${selectedColumns})
        VALUES (${placeholders})
        ON CONFLICT (id) DO UPDATE SET ${updates}
      `;

      for (const row of rows) {
        await client.query(insert, columns.map(column => row[column]));
      }

      await client.query(
        `SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE(MAX(id), 1), COUNT(*) > 0) FROM ${quoteIdentifier(table)}`,
        [table]
      );
      console.log(`Imported ${rows.length} ${table} row(s).`);
    }

    await client.query('COMMIT');
    transactionStarted = false;
  } catch (error) {
    if (transactionStarted) {
      await client.query('ROLLBACK');
      transactionStarted = false;
    }
    throw error;
  } finally {
    if (client) client.release();
    await source.close();
    await closeDb();
  }
}

importSqliteData().catch(error => {
  console.error('SQLite import failed:', error);
  process.exitCode = 1;
});

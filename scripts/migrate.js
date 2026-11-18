import 'dotenv/config';
import { closeDb, initializeDatabase } from '../src/db/index.js';

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    await initializeDatabase();
    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await closeDb();
  }
}

runMigrations();

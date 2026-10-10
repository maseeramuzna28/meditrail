import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function runMigrations() {
  console.log('--- MediTrail Database Migration Utility ---');

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not configured. Skipping remote migration.');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Check Supabase connection
  console.log(`Checking connection to: ${supabaseUrl}`);

  // Paths to SQL files
  const rootDir = path.resolve(__dirname, '../../');
  const schemaPath = path.resolve(__dirname, '../schema.sql');
  const migrationsDir = path.resolve(rootDir, 'supabase/migrations');

  console.log('Reading migration files:');
  if (fs.existsSync(schemaPath)) {
    console.log(`- backend/schema.sql (${fs.statSync(schemaPath).size} bytes)`);
  }

  if (fs.existsSync(migrationsDir)) {
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
    files.forEach(f => {
      const fullPath = path.join(migrationsDir, f);
      console.log(`- supabase/migrations/${f} (${fs.statSync(fullPath).size} bytes)`);
    });
  }

  // Verify access to tables
  const { data: records, error: recError } = await supabase.from('medical_records').select('id').limit(1);
  if (recError) {
    console.log(`Status: 'medical_records' table check - ${recError.message}`);
  } else {
    console.log(`Status: 'medical_records' table verified!`);
  }

  const { data: shares, error: shareError } = await supabase.from('share_links').select('id').limit(1);
  if (shareError) {
    console.log(`Status: 'share_links' table check - ${shareError.message}`);
  } else {
    console.log(`Status: 'share_links' table verified!`);
  }

  console.log('--- Migration inspection complete ---');
}

runMigrations().catch(err => {
  console.error('Migration error:', err);
});

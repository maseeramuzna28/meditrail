import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  // Note: Configure this to your frontend origin in production
  origin: '*'
}));
app.use(express.json());

// Verify Supabase config
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('WARNING: Missing Supabase environment variables!');
}

// Initialize Supabase Admin Client (Service Role)
// ONLY use this for privileged operations. Do NOT use this for normal user requests.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(port, () => {
  console.log(`MediTrail Backend is running on port ${port}`);
});

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(helmet());
const allowedOrigins = new Set([
  process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001'
]);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS.'));
  }
}));
app.use(express.json({ limit: '10mb' }));

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env. Do not put the service-role key in frontend code.'
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

function isUUID(value: unknown): value is string {
  return typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function normalizeCategory(raw = ''): string {
  const c = String(raw).toLowerCase().trim();
  if (c.includes('prescription')) return 'prescription';
  if (c.includes('lab')) return 'lab_report';
  if (c.includes('diagnos')) return 'diagnosis';
  if (c.includes('discharge')) return 'discharge_summary';
  if (c.includes('imag') || c.includes('x-ray') || c.includes('mri')) return 'imaging';
  if (c.includes('vaccin')) return 'vaccination';
  return 'other';
}

app.get(['/health', '/api/health'], async (_req: Request, res: Response) => {
  const { error } = await supabase.from('medical_records').select('id', { head: true }).limit(0);
  if (error) {
    console.error('Health check failed:', error.message);
    return res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      supabaseConfigured: true
    });
  }

  res.json({ status: 'healthy', timestamp: new Date().toISOString(), supabaseConfigured: true });
});

/**
 * Signup is performed on the server using the Admin API, so confirmation-email
 * delivery is not needed for this endpoint. The secret key stays server-side.
 * IMPORTANT: never return success unless Supabase actually created the user.
 */
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  const { name, email, password } = req.body ?? {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: String(email).trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { full_name: String(name).trim() }
    });

    if (error) {
      console.error('Supabase signup error:', error.message);
      const status = /already been registered|already exists/i.test(error.message) ? 409 : 400;
      return res.status(status).json({ error: error.message });
    }
    if (!data.user) {
      return res.status(500).json({ error: 'Supabase did not return a created user.' });
    }

    return res.status(201).json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || String(name).trim(),
        isLoggedIn: false
      }
    });
  } catch (error) {
    console.error('POST /api/auth/signup failed:', error);
    return res.status(500).json({ error: 'Unable to create account in Supabase.' });
  }
});

/**
 * Never grant login merely because an email exists. Verify the password through
 * Supabase Auth. The browser's direct Supabase login is also supported.
 */
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(email).trim().toLowerCase(),
      password: String(password)
    });
    if (error || !data.user) {
      return res.status(401).json({ error: error?.message || 'Invalid email or password.' });
    }

    return res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || String(email).split('@')[0],
        isLoggedIn: true
      }
    });
  } catch (error) {
    console.error('POST /api/auth/login failed:', error);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.get('/api/records', async (req: Request, res: Response) => {
  const userId = req.query.userId;
  if (!isUUID(userId)) return res.status(400).json({ error: 'A valid Supabase userId is required.' });

  const { data, error } = await supabase
    .from('medical_records')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('GET /api/records:', error.message);
    return res.status(500).json({ error: error.message });
  }

  return res.json((data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    category: row.category,
    doctor: row.doctor || '',
    hospital: row.hospital || '',
    date: row.date,
    description: row.description || '',
    fileName: row.file_name || 'Document.pdf',
    fileUrl: row.file_url || '',
    fileType: /\.(png|jpe?g|webp)$/i.test(row.file_name || '') ? 'image' : 'pdf',
    createdAt: row.created_at
  })));
});

app.post('/api/records', async (req: Request, res: Response) => {
  const { userId, title, category, doctor, hospital, date, description, fileName, fileUrl } = req.body ?? {};
  if (!isUUID(userId)) return res.status(400).json({ error: 'A valid Supabase userId is required.' });
  if (!title) return res.status(400).json({ error: 'Record title is required.' });

  const payload = {
    user_id: userId,
    title: String(title),
    category: normalizeCategory(category),
    doctor: doctor || null,
    hospital: hospital || null,
    date: date || new Date().toISOString().slice(0, 10),
    description: description || '',
    file_name: fileName || null,
    file_url: fileUrl || null
  };

  const { data, error } = await supabase.from('medical_records').insert(payload).select('*').single();
  if (error) {
    console.error('POST /api/records:', error.message);
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({
    id: data.id, userId: data.user_id, title: data.title, category: data.category,
    doctor: data.doctor || '', hospital: data.hospital || '', date: data.date,
    description: data.description || '', fileName: data.file_name || '',
    fileUrl: data.file_url || '', createdAt: data.created_at
  });
});

app.delete('/api/records/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.query.userId;
  if (!isUUID(id) || !isUUID(userId)) {
    return res.status(400).json({ error: 'Valid record id and userId are required.' });
  }
  const { error } = await supabase.from('medical_records').delete().eq('id', id).eq('user_id', userId);
  if (error) {
    console.error('DELETE /api/records:', error.message);
    return res.status(500).json({ error: error.message });
  }
  return res.json({ success: true });
});

app.post('/api/share', async (req: Request, res: Response) => {
  const { userId, doctorName, specialty, durationHours, selectedRecordIds } = req.body ?? {};
  if (!isUUID(userId)) return res.status(400).json({ error: 'A valid Supabase userId is required.' });

  const hours = Math.min(Math.max(Number(durationHours) || 24, 1), 720);
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
  const recordIds = Array.isArray(selectedRecordIds) ? selectedRecordIds.filter(isUUID) : [];

  const { data, error } = await supabase.from('share_links').insert({
    token, user_id: userId, record_ids: recordIds,
    doctor_name: doctorName || 'Consulting Doctor',
    expires_at: expiresAt, is_active: true
  }).select('*').single();

  if (error) {
    console.error('POST /api/share:', error.message);
    return res.status(500).json({ error: error.message });
  }

  await supabase.from('access_logs').insert({
    share_link_id: data.id, user_id: userId, action: 'link_created',
    details: `Share link generated (${hours}h validity)`
  });

  return res.status(201).json({
    id: data.id, token: data.token, userId: data.user_id,
    doctorName: data.doctor_name, specialty: specialty || 'General Medicine',
    createdDate: data.created_at, expiresAt: data.expires_at,
    recordIds: data.record_ids, status: data.is_active ? 'active' : 'revoked',
    accessCount: 0
  });
});

app.get('/api/share/:token', async (req: Request, res: Response) => {
  const { token } = req.params;
  const { data, error } = await supabase.from('share_links').select('*').eq('token', token).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data || !data.is_active || new Date(data.expires_at) < new Date()) {
    return res.status(404).json({ error: 'Share link is invalid, expired or revoked.' });
  }

  await supabase.from('access_logs').insert({
    share_link_id: data.id, user_id: data.user_id, action: 'link_accessed',
    details: 'A share link was accessed.'
  });

  const recordIds = Array.isArray(data.record_ids) ? data.record_ids.filter(isUUID) : [];
  const { data: records, error: recordsError } = recordIds.length
    ? await supabase.from('medical_records').select('*')
      .eq('user_id', data.user_id).in('id', recordIds)
    : { data: [], error: null };

  if (recordsError) {
    console.error('GET /api/share/:token records:', recordsError.message);
    return res.status(500).json({ error: recordsError.message });
  }

  return res.json({
    id: data.id, token: data.token, userId: data.user_id,
    doctorName: data.doctor_name, specialty: 'General Medicine',
    createdDate: data.created_at, expiresAt: data.expires_at,
    recordIds: recordIds, status: 'active',
    records: (records || []).map((row: any) => ({
      id: row.id, userId: row.user_id, title: row.title,
      category: row.category || 'Other Medical Documents',
      doctor: row.doctor || row.doctor_hospital?.split('(')[0]?.trim() || 'Dr. Unspecified',
      hospital: row.hospital || row.doctor_hospital?.match(/\((.*?)\)/)?.[1] || 'Medical Facility',
      date: row.date || row.record_date,
      description: row.description || '',
      fileType: /\.(png|jpe?g|webp)$/i.test(row.file_name || '') ? 'image' : 'pdf',
      fileName: row.file_name || 'Document.pdf',
      fileUrl: row.file_url || ''
    }))
  });
});

app.post('/api/share/:id/revoke', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body ?? {};
  if (!isUUID(id) || !isUUID(userId)) {
    return res.status(400).json({ error: 'Valid share id and userId are required.' });
  }

  const { data, error } = await supabase.from('share_links')
    .update({ is_active: false }).eq('id', id).eq('user_id', userId).select('*').maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Share link not found.' });

  await supabase.from('access_logs').insert({
    share_link_id: data.id, user_id: data.user_id,
    action: 'link_revoked', details: 'Share link revoked by owner.'
  });

  return res.json({ success: true, message: 'Access revoked successfully.' });
});

app.post('/api/ai/summary', async (req: Request, res: Response) => {
  const userId = req.body?.userId;
  let count = 0;
  if (isUUID(userId)) {
    const { count: recordCount, error } = await supabase.from('medical_records')
      .select('id', { count: 'exact', head: true }).eq('user_id', userId);
    if (error) return res.status(500).json({ error: error.message });
    count = recordCount || 0;
  }
  return res.json({
    lastGenerated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    recordCountAnalyzed: count,
    conditions: [], medications: [], testResults: [], allergies: [],
    importantHistory: [], missingInfo: []
  });
});

app.get('/api/access-logs', async (req: Request, res: Response) => {
  const userId = req.query.userId;
  if (!isUUID(userId)) return res.status(400).json({ error: 'A valid Supabase userId is required.' });

  const { data, error } = await supabase.from('access_logs').select('*')
    .eq('user_id', userId).order('created_at', { ascending: false });

  if (error) {
    console.error('GET /api/access-logs:', error.message);
    return res.status(500).json({ error: error.message });
  }

  return res.json((data || []).map((row: any) => ({
    id: row.id, action: row.action, timestamp: row.created_at,
    details: row.details || '', accessedBy: row.accessed_by_ip || 'Doctor Access Token'
  })));
});

app.listen(port, () => {
  console.log(`MediTrail backend running on http://localhost:${port}`);
});

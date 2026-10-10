// ─── Fix: Force IPv4 DNS (prevents "fetch failed" on some networks) ──────────
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// ─── Fix: Allow self-signed / corp SSL certificates ──────────────────────────
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const app        = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL || 'http://localhost:3000',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
const recordsRouter  = require('./routes/records');
const shareRouter    = require('./routes/share');
const doctorRouter   = require('./routes/doctor');
const activityRouter = require('./routes/activity');
const aiRouter       = require('./routes/ai');

app.use('/api/records',  recordsRouter);
app.use('/api/share',    shareRouter);
app.use('/api/doctor',   doctorRouter);
app.use('/api/activity', activityRouter);
app.use('/api/ai',       aiRouter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', project: 'MediTrail', timestamp: new Date().toISOString() });
});

// ─── DB Connection Test ───────────────────────────────────────────────────────
app.get('/test-db', async (req, res) => {
  const { supabaseAdmin } = require('./config/supabase');
  try {
    const { count, error } = await supabaseAdmin
      .from('medical_records')
      .select('*', { count: 'exact', head: true });
    res.json({
      status: error ? 'error' : 'ok',
      total_records: count,
      error: error?.message || null,
    });
  } catch (err) {
    res.json({ status: 'exception', error: err.message });
  }
});

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: err.message });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 MediTrail backend running on http://localhost:${PORT}`);
  console.log(`🔬 Test DB: http://localhost:${PORT}/test-db`);
  console.log(`📋 Health:  http://localhost:${PORT}/health\n`);
});

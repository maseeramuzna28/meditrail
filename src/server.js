require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
const recordsRouter = require('./routes/records');
const timelineRouter = require('./routes/timeline');
const aiRouter = require('./routes/ai');
const shareRouter = require('./routes/share');
const doctorRouter = require('./routes/doctor');
const activityRouter = require('./routes/activity');

app.use('/api/records', recordsRouter);
app.use('/api/timeline', timelineRouter);
app.use('/api/ai', aiRouter);
app.use('/api/share', shareRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/activity', activityRouter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'MediTrail',
    timestamp: new Date().toISOString()
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 MediTrail backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️  Supabase: ${process.env.SUPABASE_URL}`);
  console.log('\nAvailable endpoints:');
  console.log('  POST   /api/records         - Upload a medical record');
  console.log('  GET    /api/records         - Get all records');
  console.log('  GET    /api/records/:id     - Get a single record');
  console.log('  PUT    /api/records/:id     - Update a record');
  console.log('  DELETE /api/records/:id     - Delete a record');
  console.log('  GET    /api/timeline        - Get medical timeline');
  console.log('  GET    /api/ai/summary      - AI health summary');
  console.log('  POST   /api/share           - Create doctor share link');
  console.log('  GET    /api/share           - Get all share links');
  console.log('  DELETE /api/share/:id/revoke - Revoke a share link');
  console.log('  GET    /api/share/:id/qr    - Get QR code for share link');
  console.log('  GET    /api/doctor/:token   - Doctor views shared records');
  console.log('  GET    /api/activity        - Get activity logs');
});

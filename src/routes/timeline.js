const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

/**
 * GET /api/timeline
 * Get all records in chronological order for the patient's medical timeline.
 * Supports filtering by category.
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.query;

    let query = supabaseAdmin
      .from('medical_records')
      .select('id, title, category, doctor_hospital, date, description, file_url, file_name, created_at')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    // Filter by category if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Group records by year/month for a nice timeline structure
    const timeline = {};
    data.forEach(record => {
      const year = new Date(record.date).getFullYear();
      const month = new Date(record.date).toLocaleString('default', { month: 'long' });
      const key = `${year}-${month}`;

      if (!timeline[key]) {
        timeline[key] = { year, month, records: [] };
      }
      timeline[key].records.push(record);
    });

    res.json({
      records: data,
      timeline: Object.values(timeline)
    });
  } catch (err) {
    console.error('Timeline error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

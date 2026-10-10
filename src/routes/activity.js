const express  = require('express');
const router   = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

// GET /api/activity — get all activity logs for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('access_logs')
      .select(`
        id, action, details, accessed_by_ip, created_at,
        share_links ( token, doctor_name, record_ids, expires_at )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ logs: data || [] });
  } catch (err) {
    console.error('GET /activity error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

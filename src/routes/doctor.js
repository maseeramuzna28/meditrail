const express  = require('express');
const router   = express.Router();
const { supabaseAdmin } = require('../config/supabase');

// GET /api/doctor/:token — public endpoint, doctor views shared records
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Find the share link
    const { data: shareLink, error: linkErr } = await supabaseAdmin
      .from('share_links')
      .select('*')
      .eq('token', token)
      .eq('is_active', true)
      .single();

    if (linkErr || !shareLink) {
      return res.status(404).json({ error: 'Share link not found or has been revoked' });
    }

    // Check expiry
    if (new Date(shareLink.expires_at) < new Date()) {
      return res.status(410).json({ error: 'Share link has expired' });
    }

    // Get the shared records
    const { data: records, error: recErr } = await supabaseAdmin
      .from('medical_records')
      .select('*')
      .in('id', shareLink.record_ids);

    if (recErr) throw recErr;

    // Log access
    await supabaseAdmin.from('access_logs').insert([{
      share_link_id: shareLink.id,
      user_id:       shareLink.user_id,
      action:        'link_accessed',
      details:       `Doctor view accessed`,
      accessed_by_ip: req.ip,
    }]).catch(() => {});

    res.json({
      share: {
        token,
        doctor_name: shareLink.doctor_name,
        expires_at:  shareLink.expires_at,
        created_at:  shareLink.created_at,
      },
      records: records || [],
    });
  } catch (err) {
    console.error('GET /doctor/:token error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

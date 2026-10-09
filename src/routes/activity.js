const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

/**
 * GET /api/activity
 * Get the full activity/access history for the logged-in patient.
 * Shows link created, accessed, revoked, expired events.
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('access_logs')
      .select(`
        id,
        action,
        details,
        accessed_by_ip,
        created_at,
        share_link_id,
        share_links (
          token,
          doctor_name,
          record_ids,
          expires_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ activity_logs: data });
  } catch (err) {
    console.error('Activity logs error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/activity/share/:shareLinkId
 * Get activity logs for a specific share link
 */
router.get('/share/:shareLinkId', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { shareLinkId } = req.params;

    // Verify the share link belongs to this user
    const { data: shareLink, error: linkError } = await supabaseAdmin
      .from('share_links')
      .select('id')
      .eq('id', shareLinkId)
      .eq('user_id', userId)
      .single();

    if (linkError || !shareLink) {
      return res.status(404).json({ error: 'Share link not found' });
    }

    const { data, error } = await supabaseAdmin
      .from('access_logs')
      .select('*')
      .eq('share_link_id', shareLinkId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ activity_logs: data });
  } catch (err) {
    console.error('Share activity error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

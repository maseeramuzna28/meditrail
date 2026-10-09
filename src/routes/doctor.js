const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

/**
 * GET /api/doctor/:token
 * Public route - Doctor accesses shared records using a token.
 * No authentication required (doctor may not have an account).
 * Only returns records selected by the patient.
 */
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const doctorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Look up the share link
    const { data: shareLink, error: linkError } = await supabaseAdmin
      .from('share_links')
      .select('*')
      .eq('token', token)
      .single();

    if (linkError || !shareLink) {
      return res.status(404).json({ error: 'Invalid or expired share link' });
    }

    // Check if the link has been revoked
    if (!shareLink.is_active) {
      return res.status(403).json({ error: 'This link has been revoked by the patient' });
    }

    // Check if the link has expired
    if (new Date(shareLink.expires_at) < new Date()) {
      // Mark the link as expired in the database
      await supabaseAdmin
        .from('share_links')
        .update({ is_active: false })
        .eq('id', shareLink.id);

      // Log expiry
      await supabaseAdmin.from('access_logs').insert([{
        share_link_id: shareLink.id,
        user_id: shareLink.user_id,
        action: 'link_expired',
        details: 'Link expired on access attempt',
        accessed_by_ip: doctorIp
      }]);

      return res.status(403).json({ error: 'This share link has expired' });
    }

    // Fetch ONLY the records that were selected by the patient
    const { data: records, error: recordsError } = await supabaseAdmin
      .from('medical_records')
      .select('id, title, category, doctor_hospital, date, description, file_url, file_name')
      .in('id', shareLink.record_ids)
      .order('date', { ascending: false });

    if (recordsError) throw recordsError;

    // Log activity: link accessed by doctor
    await supabaseAdmin.from('access_logs').insert([{
      share_link_id: shareLink.id,
      user_id: shareLink.user_id,
      action: 'link_accessed',
      details: `Doctor viewed ${records.length} shared record(s)`,
      accessed_by_ip: doctorIp
    }]);

    res.json({
      records,
      share_info: {
        expires_at: shareLink.expires_at,
        doctor_name: shareLink.doctor_name,
        shared_at: shareLink.created_at
      }
    });

  } catch (err) {
    console.error('Doctor view error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express  = require('express');
const router   = express.Router();
const { v4: uuidv4 } = require('uuid');
const QRCode   = require('qrcode');
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';

// POST /api/share — create a share link
router.post('/', authenticate, async (req, res) => {
  try {
    const { record_ids, expires_in_hours = 24, doctor_name = '' } = req.body;

    if (!Array.isArray(record_ids) || record_ids.length === 0) {
      return res.status(400).json({ error: 'Select at least one record to share' });
    }

    const token     = uuidv4();
    const expiresAt = new Date(Date.now() + expires_in_hours * 3600 * 1000).toISOString();

    const { data, error } = await supabaseAdmin
      .from('share_links')
      .insert([{
        token,
        user_id:    req.user.id,
        record_ids,
        doctor_name,
        expires_at: expiresAt,
        is_active:  true,
      }])
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabaseAdmin.from('access_logs').insert([{
      share_link_id: data.id,
      user_id:       req.user.id,
      action:        'link_created',
      details:       `Shared ${record_ids.length} record(s) with ${doctor_name || 'a doctor'}`,
    }]).catch(() => {});

    const shareUrl = `${FRONTEND}?token=${token}`;
    const qrCode   = await QRCode.toDataURL(shareUrl, { width: 256, margin: 2 });

    res.status(201).json({
      message: 'Share link created',
      share: {
        id:          data.id,
        token,
        url:         shareUrl,
        qr_code:     qrCode,
        expires_at:  expiresAt,
        doctor_name,
        record_count: record_ids.length,
      },
    });
  } catch (err) {
    console.error('POST /share error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/share — get all share links for logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('share_links')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const shares = (data || []).map(s => ({
      ...s,
      url:        `${FRONTEND}?token=${s.token}`,
      is_expired: new Date(s.expires_at) < new Date(),
    }));

    res.json({ shares });
  } catch (err) {
    console.error('GET /share error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/share/:id/revoke — revoke a share link
router.delete('/:id/revoke', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('share_links')
      .update({ is_active: false })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ error: 'Share link not found' });

    await supabaseAdmin.from('access_logs').insert([{
      share_link_id: req.params.id,
      user_id:       req.user.id,
      action:        'link_revoked',
      details:       'Access revoked by patient',
    }]).catch(() => {});

    res.json({ message: 'Share link revoked' });
  } catch (err) {
    console.error('DELETE /share/:id/revoke error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

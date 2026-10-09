const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

/**
 * POST /api/share
 * Create a new doctor sharing link
 * Patient selects which records to share and sets an expiry time
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { record_ids, expires_in_hours, doctor_name } = req.body;

    if (!record_ids || !Array.isArray(record_ids) || record_ids.length === 0) {
      return res.status(400).json({ error: 'Please select at least one record to share' });
    }

    if (!expires_in_hours || expires_in_hours < 1) {
      return res.status(400).json({ error: 'Please set a valid expiry time (minimum 1 hour)' });
    }

    // Verify that all selected records belong to this user
    const { data: records, error: recordsError } = await supabaseAdmin
      .from('medical_records')
      .select('id')
      .eq('user_id', userId)
      .in('id', record_ids);

    if (recordsError) throw recordsError;

    if (records.length !== record_ids.length) {
      return res.status(403).json({ error: 'Some records do not belong to you' });
    }

    // Generate unique token for the share link
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + expires_in_hours * 60 * 60 * 1000);

    // Save the share link to database
    const { data: shareLink, error: shareError } = await supabaseAdmin
      .from('share_links')
      .insert([{
        token,
        user_id: userId,
        record_ids,
        doctor_name: doctor_name || null,
        expires_at: expiresAt,
        is_active: true
      }])
      .select()
      .single();

    if (shareError) throw shareError;

    // Log activity: link created
    await supabaseAdmin.from('access_logs').insert([{
      share_link_id: shareLink.id,
      user_id: userId,
      action: 'link_created',
      details: `Shared ${record_ids.length} record(s)${doctor_name ? ` with ${doctor_name}` : ''}`
    }]);

    // Generate the shareable URL
    const shareUrl = `${process.env.FRONTEND_URL}/doctor-view/${token}`;

    // Generate QR code as base64 image
    const qrCodeDataUrl = await QRCode.toDataURL(shareUrl, {
      width: 256,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' }
    });

    res.status(201).json({
      message: 'Share link created successfully',
      share_link: {
        id: shareLink.id,
        token,
        url: shareUrl,
        qr_code: qrCodeDataUrl,
        expires_at: expiresAt,
        record_count: record_ids.length,
        doctor_name: doctor_name || null
      }
    });

  } catch (err) {
    console.error('Create share link error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/share
 * Get all share links created by the logged-in patient
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('share_links')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Add computed fields
    const links = data.map(link => ({
      ...link,
      url: `${process.env.FRONTEND_URL}/doctor-view/${link.token}`,
      is_expired: new Date(link.expires_at) < new Date()
    }));

    res.json({ share_links: links });
  } catch (err) {
    console.error('Get share links error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/share/:id/revoke
 * Revoke (deactivate) a share link — patient can revoke at any time
 */
router.delete('/:id/revoke', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('share_links')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Share link not found or not authorized' });
    }

    // Log activity: link revoked
    await supabaseAdmin.from('access_logs').insert([{
      share_link_id: id,
      user_id: userId,
      action: 'link_revoked',
      details: 'Access revoked by patient'
    }]);

    res.json({ message: 'Share link revoked successfully' });
  } catch (err) {
    console.error('Revoke share link error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/share/:id/qr
 * Regenerate QR code for an existing share link
 */
router.get('/:id/qr', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('share_links')
      .select('token, is_active, expires_at')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Share link not found' });
    }

    const shareUrl = `${process.env.FRONTEND_URL}/doctor-view/${data.token}`;
    const qrCodeDataUrl = await QRCode.toDataURL(shareUrl, {
      width: 256,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' }
    });

    res.json({ qr_code: qrCodeDataUrl, url: shareUrl });
  } catch (err) {
    console.error('QR code error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

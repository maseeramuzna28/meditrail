const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

/**
 * POST /api/records
 * Upload a new medical record (metadata only, file uploaded directly to Supabase Storage by frontend)
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, category, doctor_hospital, date, description, file_url, file_name } = req.body;
    const userId = req.user.id;

    if (!title || !category || !date) {
      return res.status(400).json({ error: 'Title, category, and date are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('medical_records')
      .insert([{
        user_id: userId,
        title,
        category,
        doctor_hospital,
        date,
        description,
        file_url,
        file_name
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Record created successfully', record: data });
  } catch (err) {
    console.error('Create record error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/records
 * Get all records for the logged-in patient (with optional category filter)
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.query;

    let query = supabaseAdmin
      .from('medical_records')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({ records: data });
  } catch (err) {
    console.error('Get records error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/records/:id
 * Get a single record by ID (only if it belongs to the logged-in user)
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('medical_records')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ record: data });
  } catch (err) {
    console.error('Get record error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/records/:id
 * Update a record (only if it belongs to the logged-in user)
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, category, doctor_hospital, date, description, file_url, file_name } = req.body;

    const { data, error } = await supabaseAdmin
      .from('medical_records')
      .update({ title, category, doctor_hospital, date, description, file_url, file_name, updated_at: new Date() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Record not found or not authorized' });
    }

    res.json({ message: 'Record updated', record: data });
  } catch (err) {
    console.error('Update record error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/records/:id
 * Delete a record (only if it belongs to the logged-in user)
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('medical_records')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('Delete record error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

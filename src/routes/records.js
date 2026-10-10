const express  = require('express');
const router   = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

// GET /api/records — get all records for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const { category } = req.query;

    let query = supabaseAdmin
      .from('medical_records')
      .select('*')
      .eq('user_id', req.user.id)
      .order('date', { ascending: false });

    if (category && category !== 'All Records') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({ records: data || [] });
  } catch (err) {
    console.error('GET /records error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/records — create a new record
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, category, doctor, hospital, date, description, file_url, file_name } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('medical_records')
      .insert([{
        user_id:     req.user.id,
        title,
        category:    category || 'other',
        doctor:      doctor || '',
        hospital:    hospital || '',
        date,
        description: description || '',
        file_url:    file_url || null,
        file_name:   file_name || null,
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Record created', record: data });
  } catch (err) {
    console.error('POST /records error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/records/:id — get a single record
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('medical_records')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Record not found' });

    res.json({ record: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/records/:id — delete a record
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('medical_records')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ message: 'Record deleted' });
  } catch (err) {
    console.error('DELETE /records error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

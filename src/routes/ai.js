const express  = require('express');
const router   = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

// POST /api/ai/summary — generate AI health summary from records
router.post('/summary', authenticate, async (req, res) => {
  try {
    // 1. Fetch user's records
    const { data: records, error } = await supabaseAdmin
      .from('medical_records')
      .select('title, category, doctor, hospital, date, description')
      .eq('user_id', req.user.id)
      .order('date', { ascending: false })
      .limit(20);

    if (error) throw error;

    if (!records || records.length === 0) {
      return res.json({
        summary: 'No medical records found. Upload your first record to get an AI health summary.',
        categories: {},
        insights: [],
        lastUpdated: new Date().toISOString(),
      });
    }

    // 2. Build prompt
    const recordsText = records.map(r =>
      `- ${r.title} (${r.category}) on ${r.date} by ${r.doctor || 'Unknown doctor'} at ${r.hospital || 'Unknown facility'}` +
      (r.description ? `: ${r.description}` : '')
    ).join('\n');

    const prompt = `
You are a helpful medical assistant. Analyze these patient medical records and provide a brief, easy-to-understand health summary.

Medical Records:
${recordsText}

Please provide:
1. A 2-3 sentence overall health summary
2. Key health observations (max 4 bullet points)
3. Any patterns you notice

Format your response as JSON with this structure:
{
  "summary": "overall summary text",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "categories": {
    "Prescriptions": 0,
    "Lab Reports": 0,
    "Diagnoses": 0,
    "Other": 0
  }
}
    `.trim();

    // 3. Call Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    // 4. Parse JSON from Gemini response
    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
      parsed = null;
    }

    // Count categories
    const catCounts = {};
    records.forEach(r => {
      catCounts[r.category] = (catCounts[r.category] || 0) + 1;
    });

    res.json({
      summary:     parsed?.summary   || text.substring(0, 300),
      insights:    parsed?.insights  || [],
      categories:  parsed?.categories || catCounts,
      recordCount: records.length,
      lastUpdated: new Date().toISOString(),
    });

  } catch (err) {
    console.error('POST /ai/summary error:', err.message);
    // Return a fallback summary instead of an error
    res.json({
      summary: 'AI summary temporarily unavailable. Your records are safely stored.',
      insights: ['Upload more records to get better insights.'],
      categories: {},
      lastUpdated: new Date().toISOString(),
      error: err.message,
    });
  }
});

module.exports = router;

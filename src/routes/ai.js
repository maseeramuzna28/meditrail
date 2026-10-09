const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * GET /api/ai/summary
 * Generate an AI health history summary from the patient's medical records.
 * The AI summarizes existing information only — does NOT diagnose or prescribe.
 */
router.get('/summary', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all the patient's records
    const { data: records, error } = await supabaseAdmin
      .from('medical_records')
      .select('id, title, category, doctor_hospital, date, description')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    if (!records || records.length === 0) {
      return res.json({
        summary: null,
        message: 'No medical records found. Upload some records first to get your health summary.'
      });
    }

    // Build a structured text from the records for the AI
    const recordsText = records.map((r, i) =>
      `Record ${i + 1}:
      - ID: ${r.id}
      - Title: ${r.title}
      - Category: ${r.category}
      - Doctor/Hospital: ${r.doctor_hospital || 'Not specified'}
      - Date: ${r.date}
      - Description: ${r.description || 'No description'}`
    ).join('\n\n');

    const prompt = `You are a medical records assistant helping a patient understand their own health history.

Based on the following medical records, create a clear and simple health summary. 

IMPORTANT RULES:
- Only summarize what is ALREADY in the records
- Do NOT diagnose any condition
- Do NOT recommend any treatment or medication
- Do NOT give medical advice
- If a field is unclear, say "not specified"

Please extract and structure the following from the records:
1. Known Allergies (mention which record ID it came from)
2. Medical Conditions/Diagnoses (mention which record ID it came from)
3. Current/Recent Medications (mention which record ID it came from)
4. Recent Test Results (mention which record ID it came from)
5. Brief Overall Summary (2-3 sentences)

Medical Records:
${recordsText}

Respond in JSON format like this:
{
  "allergies": [{"detail": "...", "source_record_id": "..."}],
  "conditions": [{"detail": "...", "source_record_id": "..."}],
  "medications": [{"detail": "...", "source_record_id": "..."}],
  "test_results": [{"detail": "...", "source_record_id": "..."}],
  "overall_summary": "..."
}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the JSON from AI response
    let parsedSummary;
    try {
      // Extract JSON from the response (in case it has extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedSummary = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseErr) {
      // If JSON parsing fails, return the raw text
      parsedSummary = { raw: responseText };
    }

    res.json({
      summary: parsedSummary,
      records_analyzed: records.length,
      generated_at: new Date().toISOString()
    });

  } catch (err) {
    console.error('AI Summary error:', err);
    res.status(500).json({ error: 'Failed to generate AI summary: ' + err.message });
  }
});

module.exports = router;

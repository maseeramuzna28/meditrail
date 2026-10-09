import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

// Initialize Supabase Client if env vars are present
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// In-Memory Database Store (Used as instant server fallback when Supabase keys are not set)
let inMemoryRecords = [
  {
    id: 'rec-101',
    title: 'Comprehensive Blood Panel & Lipid Profile',
    category: 'Lab Reports',
    doctor: 'Dr. Sarah Jenkins',
    hospital: 'Apex Health Diagnostics',
    date: '2026-10-08',
    description: 'Fasting lipid panel, HbA1c (5.6%), CBC, and Vitamin D levels. All parameters within normal range except mild Vitamin D deficiency (22 ng/mL).',
    fileType: 'pdf',
    fileName: 'Blood_Panel_Oct2026.pdf',
    fileSize: '1.4 MB'
  },
  {
    id: 'rec-102',
    title: 'Hypertension & Vitamin Supplement Prescription',
    category: 'Prescriptions',
    doctor: 'Dr. Ahmed Khan',
    hospital: 'City Medical Center',
    date: '2026-09-25',
    description: 'Prescribed Amlodipine 5mg once daily for mild blood pressure management, and Cholecalciferol 60,000 IU weekly for 8 weeks.',
    fileType: 'prescription',
    fileName: 'Rx_Amlodipine_Sep2026.pdf',
    fileSize: '420 KB'
  },
  {
    id: 'rec-103',
    title: 'Essential Hypertension Diagnosis',
    category: 'Diagnoses',
    doctor: 'Dr. Ahmed Khan',
    hospital: 'City Medical Center',
    date: '2026-09-25',
    description: 'Stage 1 Primary Hypertension diagnosed following routine checkup (BP 138/88 mmHg). Recommended sodium restriction and exercise.',
    fileType: 'document',
    fileName: 'Diagnosis_Hypertension.pdf',
    fileSize: '850 KB'
  }
];

let inMemoryShares: any[] = [
  {
    id: 'share-901',
    token: 'mt-dr-ahmed-8821',
    doctorName: 'Dr. Ahmed Khan',
    specialty: 'Cardiology',
    createdDate: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    recordIds: ['rec-101', 'rec-102'],
    status: 'active',
    accessCount: 1
  }
];

let inMemoryLogs: any[] = [
  {
    id: 'log-001',
    timestamp: new Date().toISOString(),
    type: 'ACCESS',
    title: 'Doctor Accessed Records',
    details: 'Dr. Ahmed Khan opened 2 shared records via secure link.',
    actor: 'Dr. Ahmed Khan (Cardiology)'
  }
];

// Health check endpoint
app.get(['/health', '/api/health'], (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    supabaseConnected: !!supabase
  });
});

// API ROUTE 1: GET /api/records
app.get('/api/records', async (req: Request, res: Response) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('medical_records').select('*').order('date', { ascending: false });
      if (!error && data) return res.json(data);
    }
    res.json(inMemoryRecords);
  } catch (err) {
    res.json(inMemoryRecords);
  }
});

// API ROUTE 2: POST /api/records
app.post('/api/records', async (req: Request, res: Response) => {
  try {
    const { title, category, doctor, hospital, date, description, fileName, fileSize, fileType } = req.body;
    const newRecord = {
      id: `rec-${Date.now().toString().slice(-4)}`,
      title: title || 'Medical Record',
      category: category || 'Prescriptions',
      doctor: doctor || 'Dr. Unspecified',
      hospital: hospital || 'Health Center',
      date: date || new Date().toISOString().split('T')[0],
      description: description || '',
      fileType: fileType || 'pdf',
      fileName: fileName || 'Document.pdf',
      fileSize: fileSize || '1.2 MB'
    };

    if (supabase) {
      await supabase.from('medical_records').insert([newRecord]);
    } else {
      inMemoryRecords.unshift(newRecord);
    }

    // Add activity log
    inMemoryLogs.unshift({
      id: `log-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      type: 'UPLOAD',
      title: 'Medical Record Uploaded',
      details: `Uploaded record: "${newRecord.title}"`,
      actor: 'Patient (You)'
    });

    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save record' });
  }
});

// API ROUTE 3: DELETE /api/records/:id
app.delete('/api/records/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (supabase) {
      await supabase.from('medical_records').delete().eq('id', id);
    }
    inMemoryRecords = inMemoryRecords.filter(r => r.id !== id);
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// API ROUTE 4: POST /api/share (Create Doctor Token)
app.post('/api/share', async (req: Request, res: Response) => {
  try {
    const { doctorName, specialty, durationHours, selectedRecordIds } = req.body;
    const token = `mt-share-${Math.random().toString(36).substring(2, 8)}`;
    const expiresAt = new Date(Date.now() + (durationHours || 24) * 3600 * 1000).toISOString();

    const newShare = {
      id: `share-${Date.now().toString().slice(-4)}`,
      token,
      doctorName: doctorName || 'Consulting Doctor',
      specialty: specialty || 'General Medicine',
      createdDate: new Date().toISOString(),
      expiresAt,
      recordIds: selectedRecordIds || [],
      status: 'active',
      accessCount: 0
    };

    if (supabase) {
      await supabase.from('share_links').insert([newShare]);
    } else {
      inMemoryShares.unshift(newShare);
    }

    inMemoryLogs.unshift({
      id: `log-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      type: 'SHARE_CREATE',
      title: 'Doctor Share Created',
      details: `Created link for ${newShare.doctorName} (${newShare.recordIds.length} records, expires in ${durationHours || 24}h).`,
      actor: 'Patient (You)'
    });

    res.status(201).json(newShare);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create share token' });
  }
});

// API ROUTE 5: GET /api/share/:token (Doctor Portal Token Inspection)
app.get('/api/share/:token', async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    let share = inMemoryShares.find(s => s.token === token);
    if (!share) {
      return res.status(404).json({ error: 'Share link not found or invalid' });
    }

    const isExpired = new Date(share.expiresAt) < new Date();
    if (isExpired && share.status === 'active') {
      share.status = 'expired';
    }

    res.json(share);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch share details' });
  }
});

// API ROUTE 6: POST /api/share/:id/revoke (Revoke Access)
app.post('/api/share/:id/revoke', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const share = inMemoryShares.find(s => s.id === id);
    if (share) {
      share.status = 'revoked';
      inMemoryLogs.unshift({
        id: `log-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        type: 'REVOKE',
        title: 'Doctor Access Revoked',
        details: `Revoked access for ${share.doctorName}`,
        actor: 'Patient (You)'
      });
    }
    res.json({ success: true, message: 'Access revoked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to revoke access' });
  }
});

// API ROUTE 7: POST /api/ai/summary
app.post('/api/ai/summary', (req: Request, res: Response) => {
  res.json({
    lastGenerated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    recordCountAnalyzed: inMemoryRecords.length,
    conditions: [
      { title: 'Essential Hypertension (Stage 1)', detail: 'Diagnosed Sep 2026 by Dr. Ahmed Khan' },
      { title: 'Mild Vitamin D Deficiency', detail: 'Identified via Oct 2026 blood panel (22 ng/mL)' }
    ],
    medications: [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily in morning', purpose: 'Blood pressure regulation' },
      { name: 'Cholecalciferol (Vitamin D3)', dosage: '60,000 IU', frequency: 'Weekly for 8 weeks', purpose: 'Vitamin D supplementation' }
    ],
    testResults: [
      { test: 'HbA1c', value: '5.6%', status: 'Normal', date: '08 Oct 2026' },
      { test: 'Ejection Fraction (ECG)', value: '62%', status: 'Normal', date: '10 Aug 2026' }
    ],
    allergies: [
      { allergen: 'Penicillin', severity: 'Moderate', reaction: 'Skin rash & hives reported in 2022' }
    ],
    importantHistory: [
      { year: '2026', event: 'Initiated primary hypertension management protocol.' }
    ],
    missingInfo: [
      'Vaccination & Immunization history',
      'Recent Renal Function Panel (Creatinine / BUN)'
    ]
  });
});

// API ROUTE 8: GET /api/access-logs
app.get('/api/access-logs', (req: Request, res: Response) => {
  res.json(inMemoryLogs);
});

// Start Express Server
app.listen(port, () => {
  console.log(`MediTrail Express REST Backend server running on http://localhost:${port}`);
});

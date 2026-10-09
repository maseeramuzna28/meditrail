// Centralized Mock Data & API Service Layer for MediTrail
// Backed by localStorage to persist changes during demo & easily swap with Express/Node backend APIs

const STORAGE_KEYS = {
  RECORDS: 'meditrail_records',
  SHARES: 'meditrail_shares',
  LOGS: 'meditrail_logs',
  USER: 'meditrail_user'
};

const INITIAL_RECORDS = [
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
  },
  {
    id: 'rec-104',
    title: 'Annual Cardiovascular Checkup Summary',
    category: 'Discharge Summaries',
    doctor: 'Dr. Elena Rostova',
    hospital: 'St. Jude Heart Institute',
    date: '2026-08-10',
    description: 'Routine outpatient evaluation. Normal ECG, 2D Echocardiogram shows normal ejection fraction (62%). Patient cleared for moderate activity.',
    fileType: 'summary',
    fileName: 'Cardio_Evaluation_Aug2026.pdf',
    fileSize: '2.8 MB'
  },
  {
    id: 'rec-105',
    title: 'Fitness & Physical Activity Certificate',
    category: 'Medical Certificates',
    doctor: 'Dr. Robert Miller',
    hospital: 'Metro Sports Clinic',
    date: '2026-06-15',
    description: 'Medical fitness clearance for corporate marathon participation following physical examination and resting ECG.',
    fileType: 'certificate',
    fileName: 'Fitness_Clearance_Jun2026.pdf',
    fileSize: '510 KB'
  }
];

const INITIAL_SHARES = [
  {
    id: 'share-901',
    token: 'mt-dr-ahmed-8821',
    doctorName: 'Dr. Ahmed Khan',
    specialty: 'Cardiology',
    createdDate: '2026-10-09T18:30:00.000Z',
    expiresAt: new Date(Date.now() + 23 * 3600 * 1000 + 42 * 60 * 1000).toISOString(), // 23h 42m left
    recordIds: ['rec-101', 'rec-102'],
    status: 'active', // 'active' | 'revoked' | 'expired'
    accessCount: 3,
    lastAccessed: '2026-10-09T19:42:00.000Z'
  }
];

const INITIAL_LOGS = [
  {
    id: 'log-001',
    timestamp: '2026-10-09T19:42:00.000Z',
    type: 'ACCESS',
    title: 'Doctor Accessed Records',
    details: 'Dr. Ahmed Khan viewed 2 shared records via secure link.',
    actor: 'Dr. Ahmed Khan (Cardiology)'
  },
  {
    id: 'log-002',
    timestamp: '2026-10-09T18:30:00.000Z',
    type: 'SHARE_CREATE',
    title: 'Temporary Share Link Created',
    details: 'Share created with 24-hour expiry for 2 selected records.',
    actor: 'Patient (You)'
  },
  {
    id: 'log-003',
    timestamp: '2026-10-08T10:15:00.000Z',
    type: 'UPLOAD',
    title: 'New Medical Record Uploaded',
    details: 'Uploaded "Comprehensive Blood Panel & Lipid Profile"',
    actor: 'Patient (You)'
  }
];

// Helper to load or initialize storage
const getItem = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setItem = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error', e);
  }
};

export const mockStore = {
  // Auth simulation
  getUser: () => getItem(STORAGE_KEYS.USER, { id: 'u-1', name: 'Alex Mercer', email: 'alex.mercer@meditrail.org', isLoggedIn: true }),
  login: (email) => {
    const user = { id: 'u-1', name: email.split('@')[0] || 'Patient', email, isLoggedIn: true };
    setItem(STORAGE_KEYS.USER, user);
    return user;
  },
  logout: () => {
    const user = { id: 'u-1', name: 'Guest', email: '', isLoggedIn: false };
    setItem(STORAGE_KEYS.USER, user);
    return user;
  },

  // Records CRUD
  getRecords: () => {
    let records = getItem(STORAGE_KEYS.RECORDS, null);
    if (!records) {
      records = INITIAL_RECORDS;
      setItem(STORAGE_KEYS.RECORDS, records);
    }
    return records;
  },
  addRecord: (recordData) => {
    const records = mockStore.getRecords();
    const newRecord = {
      id: `rec-${Date.now().toString().slice(-4)}`,
      title: recordData.title,
      category: recordData.category || 'Other Medical Documents',
      doctor: recordData.doctor || 'Unspecified Doctor',
      hospital: recordData.hospital || 'Unspecified Hospital/Lab',
      date: recordData.date || new Date().toISOString().split('T')[0],
      description: recordData.description || 'Uploaded document record.',
      fileType: recordData.fileType || 'pdf',
      fileName: recordData.fileName || `${recordData.title.replace(/\s+/g, '_')}.pdf`,
      fileSize: recordData.fileSize || '1.2 MB'
    };
    const updated = [newRecord, ...records];
    setItem(STORAGE_KEYS.RECORDS, updated);

    // Log event
    mockStore.addLog({
      type: 'UPLOAD',
      title: 'Medical Record Uploaded',
      details: `Uploaded record: "${newRecord.title}"`,
      actor: 'Patient (You)'
    });

    return newRecord;
  },
  deleteRecord: (id) => {
    const records = mockStore.getRecords();
    const target = records.find(r => r.id === id);
    const updated = records.filter(r => r.id !== id);
    setItem(STORAGE_KEYS.RECORDS, updated);

    if (target) {
      mockStore.addLog({
        type: 'DELETE',
        title: 'Medical Record Removed',
        details: `Deleted record: "${target.title}"`,
        actor: 'Patient (You)'
      });
    }
    return true;
  },

  // Sharing API
  getShares: () => {
    let shares = getItem(STORAGE_KEYS.SHARES, null);
    if (!shares) {
      shares = INITIAL_SHARES;
      setItem(STORAGE_KEYS.SHARES, shares);
    }
    return shares;
  },
  createShare: ({ doctorName, specialty, durationHours, selectedRecordIds }) => {
    const shares = mockStore.getShares();
    const token = `mt-share-${Math.random().toString(36).substring(2, 8)}`;
    const expiresAt = new Date(Date.now() + durationHours * 3600 * 1000).toISOString();
    
    const newShare = {
      id: `share-${Date.now().toString().slice(-4)}`,
      token,
      doctorName: doctorName || 'Consulting Physician',
      specialty: specialty || 'General Medicine',
      createdDate: new Date().toISOString(),
      expiresAt,
      recordIds: selectedRecordIds,
      status: 'active',
      accessCount: 0,
      lastAccessed: null
    };

    const updated = [newShare, ...shares];
    setItem(STORAGE_KEYS.SHARES, updated);

    mockStore.addLog({
      type: 'SHARE_CREATE',
      title: 'Temporary Doctor Share Created',
      details: `Created link for ${doctorName || 'Doctor'} (${selectedRecordIds.length} records, expires in ${durationHours}h).`,
      actor: 'Patient (You)'
    });

    return newShare;
  },
  revokeShare: (shareId) => {
    const shares = mockStore.getShares();
    const updated = shares.map(s => {
      if (s.id === shareId) {
        return { ...s, status: 'revoked' };
      }
      return s;
    });
    setItem(STORAGE_KEYS.SHARES, updated);

    const target = shares.find(s => s.id === shareId);
    if (target) {
      mockStore.addLog({
        type: 'REVOKE',
        title: 'Doctor Access Revoked',
        details: `Revoked share token for ${target.doctorName}.`,
        actor: 'Patient (You)'
      });
    }
    return true;
  },
  getShareByToken: (token) => {
    const shares = mockStore.getShares();
    const share = shares.find(s => s.token === token);
    if (!share) return null;

    // Check expiration
    const isExpired = new Date(share.expiresAt) < new Date();
    if (isExpired && share.status === 'active') {
      share.status = 'expired';
      setItem(STORAGE_KEYS.SHARES, shares);
    }

    // Increment access count if active
    if (share.status === 'active') {
      share.accessCount = (share.accessCount || 0) + 1;
      share.lastAccessed = new Date().toISOString();
      setItem(STORAGE_KEYS.SHARES, shares);

      // Record access in logs
      mockStore.addLog({
        type: 'ACCESS',
        title: 'Doctor Accessed Records',
        details: `${share.doctorName} opened shared records link.`,
        actor: share.doctorName
      });
    }

    return share;
  },

  // Audit Logs
  getLogs: () => {
    let logs = getItem(STORAGE_KEYS.LOGS, null);
    if (!logs) {
      logs = INITIAL_LOGS;
      setItem(STORAGE_KEYS.LOGS, logs);
    }
    return logs;
  },
  addLog: ({ type, title, details, actor }) => {
    const logs = mockStore.getLogs();
    const newLog = {
      id: `log-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      type,
      title,
      details,
      actor: actor || 'Patient (You)'
    };
    const updated = [newLog, ...logs];
    setItem(STORAGE_KEYS.LOGS, updated);
  },

  // AI Summary Generation
  getAISummary: () => {
    const records = mockStore.getRecords();
    return {
      lastGenerated: 'Today at 08:30 AM',
      recordCountAnalyzed: records.length,
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
        { test: 'Ejection Fraction (ECG)', value: '62%', status: 'Normal', date: '10 Aug 2026' },
        { test: 'Resting Blood Pressure', value: '138/88 mmHg', status: 'Slightly Elevated', date: '25 Sep 2026' }
      ],
      allergies: [
        { allergen: 'Penicillin', severity: 'Moderate', reaction: 'Skin rash & hives reported in 2022' }
      ],
      importantHistory: [
        { year: '2026', event: 'Cardiovascular Risk Assessment cleared for athletic activities.' },
        { year: '2026', event: 'Initiated primary hypertension management protocol.' }
      ],
      missingInfo: [
        'Vaccination & Immunization history',
        'Recent Renal Function Panel (Creatinine / BUN)'
      ]
    };
  }
};

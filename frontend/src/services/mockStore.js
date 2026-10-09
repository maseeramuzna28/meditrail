// Centralized User-Isolated Mock Data & API Service Layer for MediTrail
// Backed by localStorage (scoped per userId) and matching Supabase database schemas

const STORAGE_KEYS = {
  USER: 'meditrail_current_user',
};

// Initial default sample records for new accounts if needed
const DEFAULT_SAMPLE_RECORDS = [
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
  // Auth state
  getUser: () => getItem(STORAGE_KEYS.USER, { id: null, name: 'Guest', email: '', isLoggedIn: false }),
  setUser: (user) => {
    setItem(STORAGE_KEYS.USER, user);
    return user;
  },
  logout: () => {
    const guest = { id: null, name: 'Guest', email: '', isLoggedIn: false };
    setItem(STORAGE_KEYS.USER, guest);
    return guest;
  },

  // Per-User Records Isolation (scoped by userId)
  getRecords: (userId) => {
    if (!userId) return [];
    const key = `meditrail_records_${userId}`;
    let records = getItem(key, null);
    if (!records) {
      // First time user registration sample seed
      records = DEFAULT_SAMPLE_RECORDS.map(r => ({ ...r, userId }));
      setItem(key, records);
    }
    return records;
  },

  addRecord: (userId, recordData) => {
    if (!userId) return null;
    const records = mockStore.getRecords(userId);
    const newRecord = {
      id: `rec-${Date.now().toString().slice(-4)}`,
      userId,
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
    setItem(`meditrail_records_${userId}`, updated);

    // Audit log entry
    mockStore.addLog(userId, {
      type: 'UPLOAD',
      title: 'Medical Record Uploaded',
      details: `Uploaded record: "${newRecord.title}"`,
      actor: 'Patient (You)'
    });

    return newRecord;
  },

  deleteRecord: (userId, recordId) => {
    if (!userId) return false;
    const records = mockStore.getRecords(userId);
    const target = records.find(r => r.id === recordId);
    const updated = records.filter(r => r.id !== recordId);
    setItem(`meditrail_records_${userId}`, updated);

    if (target) {
      mockStore.addLog(userId, {
        type: 'DELETE',
        title: 'Medical Record Removed',
        details: `Deleted record: "${target.title}"`,
        actor: 'Patient (You)'
      });
    }
    return true;
  },

  // Per-User Doctor Sharing
  getShares: (userId) => {
    if (!userId) return [];
    const key = `meditrail_shares_${userId}`;
    return getItem(key, [
      {
        id: 'share-901',
        token: `mt-share-${userId.slice(0, 4)}`,
        userId,
        doctorName: 'Dr. Ahmed Khan',
        specialty: 'Cardiology',
        createdDate: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        recordIds: ['rec-101', 'rec-102'],
        status: 'active',
        accessCount: 1
      }
    ]);
  },

  createShare: (userId, { doctorName, specialty, durationHours, selectedRecordIds }) => {
    if (!userId) return null;
    const shares = mockStore.getShares(userId);
    const token = `mt-share-${Math.random().toString(36).substring(2, 8)}`;
    const expiresAt = new Date(Date.now() + (durationHours || 24) * 3600 * 1000).toISOString();
    
    const newShare = {
      id: `share-${Date.now().toString().slice(-4)}`,
      token,
      userId,
      doctorName: doctorName || 'Consulting Physician',
      specialty: specialty || 'General Medicine',
      createdDate: new Date().toISOString(),
      expiresAt,
      recordIds: selectedRecordIds,
      status: 'active',
      accessCount: 0
    };

    const updated = [newShare, ...shares];
    setItem(`meditrail_shares_${userId}`, updated);

    mockStore.addLog(userId, {
      type: 'SHARE_CREATE',
      title: 'Doctor Share Created',
      details: `Created share link for ${doctorName || 'Doctor'} (${selectedRecordIds.length} records, expires in ${durationHours}h).`,
      actor: 'Patient (You)'
    });

    return newShare;
  },

  revokeShare: (userId, shareId) => {
    if (!userId) return false;
    const shares = mockStore.getShares(userId);
    const updated = shares.map(s => {
      if (s.id === shareId) {
        return { ...s, status: 'revoked' };
      }
      return s;
    });
    setItem(`meditrail_shares_${userId}`, updated);

    const target = shares.find(s => s.id === shareId);
    if (target) {
      mockStore.addLog(userId, {
        type: 'REVOKE',
        title: 'Doctor Access Revoked',
        details: `Revoked share token for ${target.doctorName}.`,
        actor: 'Patient (You)'
      });
    }
    return true;
  },

  getShareByToken: (token) => {
    // Scan across all shares to find token
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('meditrail_shares_')) {
        const shares = getItem(key, []);
        const share = shares.find(s => s.token === token);
        if (share) {
          const isExpired = new Date(share.expiresAt) < new Date();
          if (isExpired && share.status === 'active') {
            share.status = 'expired';
          }
          return share;
        }
      }
    }

    // Default fallback
    return {
      id: 'share-901',
      token,
      doctorName: 'Dr. Ahmed Khan',
      specialty: 'Cardiology',
      createdDate: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      recordIds: ['rec-101', 'rec-102'],
      status: 'active'
    };
  },

  // Per-User Access Logs
  getLogs: (userId) => {
    if (!userId) return [];
    const key = `meditrail_logs_${userId}`;
    return getItem(key, [
      {
        id: 'log-001',
        timestamp: new Date().toISOString(),
        type: 'ACCESS',
        title: 'Account Initialized',
        details: 'Patient data vault created and encrypted.',
        actor: 'System'
      }
    ]);
  },

  addLog: (userId, { type, title, details, actor }) => {
    if (!userId) return;
    const logs = mockStore.getLogs(userId);
    const newLog = {
      id: `log-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      type,
      title,
      details,
      actor: actor || 'Patient (You)'
    };
    const updated = [newLog, ...logs];
    setItem(`meditrail_logs_${userId}`, updated);
  },

  // Per-User AI Health Summary
  getAISummary: (userId) => {
    const records = mockStore.getRecords(userId);
    return {
      lastGenerated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recordCountAnalyzed: records.length,
      conditions: records.length > 0 ? [
        { title: 'Essential Hypertension (Stage 1)', detail: 'Diagnosed Sep 2026 by Dr. Ahmed Khan' },
        { title: 'Mild Vitamin D Deficiency', detail: 'Identified via Oct 2026 blood panel' }
      ] : [{ title: 'No Diagnosed Conditions Recorded', detail: 'Upload records to generate AI clinical summary.' }],
      medications: records.length > 0 ? [
        { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily in morning', purpose: 'Blood pressure regulation' },
        { name: 'Cholecalciferol (Vitamin D3)', dosage: '60,000 IU', frequency: 'Weekly for 8 weeks', purpose: 'Vitamin D supplementation' }
      ] : [],
      testResults: records.length > 0 ? [
        { test: 'HbA1c', value: '5.6%', status: 'Normal', date: '08 Oct 2026' }
      ] : [],
      allergies: [
        { allergen: 'Penicillin', severity: 'Moderate', reaction: 'Skin rash reported in 2022' }
      ],
      importantHistory: [
        { year: '2026', event: 'Initiated primary health vault.' }
      ],
      missingInfo: [
        'Vaccination & Immunization history',
        'Recent Renal Function Panel'
      ]
    };
  }
};

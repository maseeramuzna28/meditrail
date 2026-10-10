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
    hospital: 'Apex Health Diagnostics (ABC Hospital)',
    date: '2026-10-08',
    description: 'Fasting lipid profile, HbA1c (5.6%), CBC with differential, and Vitamin D levels. All parameters within normal reference ranges except mild Vitamin D deficiency (22 ng/mL).',
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
    title: 'Hospital Visit & Discharge Summary — Gastroenteritis',
    category: 'Discharge Summaries',
    doctor: 'Dr. Robert Chen, MD',
    hospital: 'XYZ Hospital — Acute Care',
    date: '2026-08-10',
    description: 'Inpatient observation for acute dehydration secondary to gastroenteritis. IV rehydration completed. Discharged in stable condition with oral rehydration protocol.',
    fileType: 'pdf',
    fileName: 'Discharge_Summary_Aug2026.pdf',
    fileSize: '2.1 MB'
  },
  {
    id: 'rec-104',
    title: 'Chest Radiograph & Pulmonary Diagnostic Examination',
    category: 'Diagnoses',
    doctor: 'Dr. Elena Rostova',
    hospital: 'Apex Imaging Institute',
    date: '2026-06-14',
    description: 'Standard 2-view PA and lateral chest radiograph. Clear bilateral lung fields, normal cardiothoracic ratio, no active pulmonary infiltrates detected.',
    fileType: 'image',
    fileName: 'Chest_XRay_PA_Jun2026.jpg',
    fileSize: '3.8 MB'
  },
  {
    id: 'rec-105',
    title: 'Adult Immunization & Booster Certificate',
    category: 'Medical Certificates',
    doctor: 'Dr. Marcus Vance',
    hospital: 'Metro Public Health Clinic',
    date: '2026-04-12',
    description: 'Official certification for Tdap (Tetanus, Diphtheria, Pertussis) booster and Seasonal Influenza vaccine administration.',
    fileType: 'pdf',
    fileName: 'Immunization_Certificate_2026.pdf',
    fileSize: '650 KB'
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
      records = userId === 'demo-patient-local'
        ? DEFAULT_SAMPLE_RECORDS.map(r => ({ ...r, userId }))
        : [];
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
    return getItem(key, userId === 'demo-patient-local' ? [
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
    ] : []);
  },

  createShare: (userId, { doctorName, specialty, durationHours, selectedRecordIds }) => {
    if (!userId) return null;
    const shares = mockStore.getShares(userId);
    const tokenPrefix = userId === 'demo-patient-local'
      ? 'mt-demo-'
      : userId.startsWith('local-') ? 'mt-local-' : 'mt-share-';
    const token = `${tokenPrefix}${Math.random().toString(36).substring(2, 10)}`;
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

  saveShare: (userId, share) => {
    if (!userId) return share;
    const shares = mockStore.getShares(userId);
    const updated = [
      share,
      ...shares.filter(existing => existing.id !== share.id && existing.token !== share.token)
    ];
    setItem(`meditrail_shares_${userId}`, updated);
    return share;
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

    return null;
  },

  // Per-User Access Logs
  getLogs: (userId) => {
    if (!userId) return [];
    const key = `meditrail_logs_${userId}`;
    return getItem(key, userId === 'demo-patient-local' ? [
      {
        id: 'log-001',
        timestamp: new Date().toISOString(),
        type: 'ACCESS',
        title: 'Account Initialized',
        details: 'Patient data vault created and encrypted.',
        actor: 'System'
      }
    ] : []);
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
    const recordSource = (record) =>
      [record.doctor, record.hospital, record.date].filter(Boolean).join(' · ');
    const recordsInCategory = (...categories) =>
      records.filter(record => categories.some(category =>
        (record.category || '').toLowerCase().includes(category)
      ));

    return {
      lastGenerated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recordCountAnalyzed: records.length,
      conditions: recordsInCategory('diagnos', 'discharge').map(record => ({
        name: record.title,
        source: recordSource(record),
        status: 'See source record'
      })),
      medications: recordsInCategory('prescription').map(record => ({
        name: record.title,
        dosage: 'See prescription',
        frequency: 'See source record',
        purpose: record.description || 'Refer to the original prescription.'
      })),
      testResults: recordsInCategory('lab').map(record => ({
        test: record.title,
        value: 'See report',
        status: 'Review source report',
        range: recordSource(record) || 'See original report'
      })),
      allergies: [],
      history: records.map(record => ({
        event: record.title,
        date: record.date || 'Date not provided',
        facility: record.hospital || record.doctor || 'Facility not provided'
      })),
      missingInfo: [
        'Allergy information is not structured in these records; confirm it with your healthcare professional.'
      ]
    };
  }
};

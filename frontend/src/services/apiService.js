// API Integration Service Layer for MediTrail
// Unified synchronization between Local Storage, Express REST Backend, and Supabase

import { mockStore } from './mockStore';
import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const DEMO_USER_ID = 'demo-patient-local';
const isLocalUser = (userId) => userId === DEMO_USER_ID || userId?.startsWith('local-');

export const apiService = {
  // Medical Records (Guaranteed immediate local visibility + backend/Supabase sync)
  getRecords: async (userId) => {
    if (!userId) return [];
    
    // 1. Get locally persisted records for this user (guaranteed instant display)
    const localRecords = mockStore.getRecords(userId) || [];
    if (isLocalUser(userId)) return localRecords;

    // 2. Fetch remote records from Express backend or Supabase
    let remoteRecords = [];
    try {
      const res = await fetch(`${API_BASE_URL}/records?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          remoteRecords = data.map(r => ({
            id: r.id,
            userId: r.user_id || userId,
            title: r.title,
            category: r.category || 'Other Medical Documents',
            doctor: r.doctor || r.doctor_hospital?.split('(')[0]?.trim() || 'Dr. Unspecified',
            hospital: r.hospital || r.doctor_hospital?.match(/\((.*?)\)/)?.[1] || 'Medical Facility',
            date: r.date || r.record_date || new Date().toISOString().split('T')[0],
            description: r.description || '',
            fileType: r.fileType || 'pdf',
            fileName: r.fileName || r.file_name || 'Document.pdf',
            fileSize: r.fileSize || '1.2 MB'
          }));
        }
      }
    } catch (e) {
      // Remote server unavailable or offline
    }

    // 3. Merge & deduplicate by ID and Title
    const mergedMap = new Map();
    // First insert remote
    remoteRecords.forEach(r => mergedMap.set(r.id, r));
    // Local records take priority (contains newly added records)
    localRecords.forEach(r => mergedMap.set(r.id, r));

    const finalRecords = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return finalRecords;
  },

  addRecord: async (userId, recordData) => {
    if (!userId) {
      throw new Error('User authentication required to save records');
    }
    if (isLocalUser(userId)) return mockStore.addRecord(userId, recordData);

    let savedRecord = null;
    let saveError = null;

    // 1. Sync to Express REST Backend
    try {
      const res = await fetch(`${API_BASE_URL}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: recordData.title,
          category: recordData.category,
          doctor: recordData.doctor,
          hospital: recordData.hospital,
          date: recordData.date,
          description: recordData.description,
          fileName: recordData.fileName,
          fileUrl: recordData.fileUrl || '',
          fileSize: recordData.fileSize
        })
      });

      if (res.ok) {
        savedRecord = await res.json();
      } else {
        const errJson = await res.json().catch(() => ({}));
        saveError = new Error(errJson.error || `Backend server returned ${res.status}`);
      }
    } catch (e) {
      saveError = e;
      console.warn('Backend server unavailable:', e);
    }

    // 2. Direct Supabase Fallback if Backend is down
    if (!savedRecord) {
      try {
        const catMap = (recordData.category || '').toLowerCase();
        let normalizedCategory = 'other';
        if (catMap.includes('prescription')) normalizedCategory = 'prescription';
        else if (catMap.includes('lab')) normalizedCategory = 'lab_report';
        else if (catMap.includes('diagnos')) normalizedCategory = 'diagnosis';
        else if (catMap.includes('discharge')) normalizedCategory = 'discharge_summary';
        else if (catMap.includes('imag')) normalizedCategory = 'imaging';
        else if (catMap.includes('vaccin')) normalizedCategory = 'vaccination';

        const { data, error } = await supabase.from('medical_records').insert([{
          user_id: userId,
          title: recordData.title,
          category: normalizedCategory,
          doctor: recordData.doctor || 'Dr. Unspecified',
          hospital: recordData.hospital || 'Health Center',
          date: recordData.date || new Date().toISOString().split('T')[0],
          description: recordData.description || '',
          file_name: recordData.fileName || 'Document.pdf',
          file_url: recordData.fileUrl || ''
        }]).select();

        if (error) {
          throw new Error(error.message);
        }

        if (data && data.length > 0) {
          const row = data[0];
          savedRecord = {
            id: row.id,
            userId: row.user_id,
            title: row.title,
            category: row.category,
            doctor: row.doctor,
            hospital: row.hospital,
            date: row.date,
            description: row.description,
            fileName: row.file_name,
            fileUrl: row.file_url,
            fileType: (row.file_name?.endsWith('.png') || row.file_name?.endsWith('.jpg')) ? 'image' : 'pdf',
            fileSize: recordData.fileSize || '1.5 MB'
          };
          saveError = null;
        }
      } catch (directErr) {
        if (!saveError) saveError = directErr;
      }
    }

    // If both backend and direct Supabase failed, throw so the UI never displays false success!
    if (!savedRecord) {
      throw saveError || new Error('Failed to save record to database');
    }

    // 3. Persist to local cache only after true database confirmation
    mockStore.addRecord(userId, savedRecord);

    return savedRecord;
  },

  deleteRecord: async (userId, recordId) => {
    if (!userId) return false;

    // 1. Remove from local store immediately
    mockStore.deleteRecord(userId, recordId);
    if (isLocalUser(userId)) return true;

    // 2. Sync deletion to Express Backend
    try {
      await fetch(`${API_BASE_URL}/records/${recordId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend delete error:', e);
    }

    // 3. Sync deletion to Supabase
    try {
      await supabase.from('medical_records').delete().eq('id', recordId);
    } catch (e) {
      // Supabase delete error
    }

    return true;
  },

  // Doctor Sharing
  getShares: async (userId) => {
    if (!userId) return [];
    return mockStore.getShares(userId);
  },

  createShare: async (userId, shareConfig) => {
    if (!userId) return null;
    const localShare = mockStore.createShare(userId, shareConfig);
    if (isLocalUser(userId)) return localShare;

    // Sync to Express Backend
    try {
      const res = await fetch(`${API_BASE_URL}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          doctorName: shareConfig.doctorName,
          specialty: shareConfig.specialty,
          durationHours: shareConfig.durationHours,
          selectedRecordIds: shareConfig.selectedRecordIds
        })
      });
      if (res.ok) {
        const remoteShare = await res.json();
        return mockStore.saveShare(userId, {
          ...remoteShare,
          specialty: shareConfig.specialty || 'General Medicine'
        });
      }
      console.warn('Backend share creation failed:', res.status);
    } catch (e) {
      console.warn('Backend share sync error:', e);
    }

    return localShare;
  },

  getShareByToken: async (token) => {
    if (token.startsWith('mt-demo-') || token.startsWith('mt-local-')) {
      return mockStore.getShareByToken(token);
    }

    // Try Backend API
    try {
      const res = await fetch(`${API_BASE_URL}/share/${encodeURIComponent(token)}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    return mockStore.getShareByToken(token);
  },

  getSharedRecordsByToken: async (token) => {
    const share = await apiService.getShareByToken(token);
    if (!share) return null;
    if (Array.isArray(share.records)) return share;

    const recordIds = Array.isArray(share.recordIds) ? share.recordIds : [];
    const records = share.userId
      ? mockStore.getRecords(share.userId).filter(record => recordIds.includes(record.id))
      : [];

    return { ...share, records };
  },

  revokeShare: async (userId, shareId) => {
    if (!userId) return false;
    mockStore.revokeShare(userId, shareId);
    if (isLocalUser(userId)) return true;

    try {
      await fetch(`${API_BASE_URL}/share/${shareId}/revoke`, { method: 'POST' });
    } catch (e) {}

    return true;
  },

  // AI Health Summary
  getAISummary: async (userId) => {
    return mockStore.getAISummary(userId);
  },

  // Access Logs
  getLogs: async (userId) => {
    if (!userId) return [];
    return mockStore.getLogs(userId);
  }
};

// API Integration Service Layer for MediTrail
// Unified synchronization between Local Storage, Express REST Backend, and Supabase

import { mockStore } from './mockStore';
import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiService = {
  // Medical Records (Guaranteed immediate local visibility + backend/Supabase sync)
  getRecords: async (userId) => {
    if (!userId) return [];
    
    // 1. Get locally persisted records for this user (guaranteed instant display)
    const localRecords = mockStore.getRecords(userId) || [];

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
    if (!userId) return null;

    // 1. Save immediately to Local Store (Guarantees vault updates immediately!)
    const savedLocal = mockStore.addRecord(userId, recordData);

    // 2. Sync to Express Backend
    try {
      await fetch(`${API_BASE_URL}/records`, {
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
          fileSize: recordData.fileSize
        })
      });
    } catch (e) {
      console.warn('Backend sync warning:', e);
    }

    // 3. Sync to Supabase directly if connected
    try {
      await supabase.from('medical_records').insert([{
        user_id: userId,
        title: recordData.title,
        category: recordData.category?.toLowerCase().replace(/\s+/g, '_') || 'other',
        doctor_hospital: `${recordData.doctor} (${recordData.hospital})`,
        date: recordData.date,
        description: recordData.description,
        file_name: recordData.fileName
      }]);
    } catch (e) {
      // Supabase direct sync error
    }

    return savedLocal;
  },

  deleteRecord: async (userId, recordId) => {
    if (!userId) return false;

    // 1. Remove from local store immediately
    mockStore.deleteRecord(userId, recordId);

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

    // Sync to Express Backend
    try {
      await fetch(`${API_BASE_URL}/share`, {
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
    } catch (e) {
      console.warn('Backend share sync error:', e);
    }

    return localShare;
  },

  getShareByToken: async (token) => {
    // Try Backend API
    try {
      const res = await fetch(`${API_BASE_URL}/share/${token}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    return mockStore.getShareByToken(token);
  },

  revokeShare: async (userId, shareId) => {
    if (!userId) return false;
    mockStore.revokeShare(userId, shareId);

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

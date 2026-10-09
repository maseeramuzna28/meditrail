// API Integration Service Layer for MediTrail
// Scoped per logged-in userId for strict multi-user privacy isolation

import { mockStore } from './mockStore';
import { supabase } from './supabaseClient';

const USE_REAL_BACKEND = true; 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiService = {
  // Medical Records (User Isolated)
  getRecords: async (userId) => {
    if (!userId) return [];
    
    // Try Supabase directly first for instant user isolation
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase fetch fallback:', e);
    }

    // Try Express Backend
    try {
      const res = await fetch(`${API_BASE_URL}/records?userId=${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback to per-user isolated storage
    }

    return mockStore.getRecords(userId);
  },

  addRecord: async (userId, recordData) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('medical_records')
        .insert([{
          user_id: userId,
          title: recordData.title,
          category: recordData.category?.toLowerCase().replace(/\s+/g, '_') || 'other',
          doctor_hospital: `${recordData.doctor} (${recordData.hospital})`,
          date: recordData.date,
          description: recordData.description,
          file_name: recordData.fileName
        }])
        .select();

      if (!error && data?.[0]) return data[0];
    } catch (e) {
      console.warn('Supabase insert fallback:', e);
    }

    return mockStore.addRecord(userId, recordData);
  },

  deleteRecord: async (userId, recordId) => {
    if (!userId) return false;

    try {
      await supabase.from('medical_records').delete().eq('id', recordId).eq('user_id', userId);
    } catch (e) {
      console.warn('Supabase delete fallback:', e);
    }

    return mockStore.deleteRecord(userId, recordId);
  },

  // Doctor Sharing (User Isolated)
  getShares: async (userId) => {
    if (!userId) return [];
    return mockStore.getShares(userId);
  },

  createShare: async (userId, shareConfig) => {
    if (!userId) return null;
    return mockStore.createShare(userId, shareConfig);
  },

  getShareByToken: async (token) => {
    return mockStore.getShareByToken(token);
  },

  revokeShare: async (userId, shareId) => {
    if (!userId) return false;
    return mockStore.revokeShare(userId, shareId);
  },

  // AI Health Summary
  getAISummary: async (userId) => {
    if (!userId) return mockStore.getAISummary(null);
    return mockStore.getAISummary(userId);
  },

  // Access Logs
  getLogs: async (userId) => {
    if (!userId) return [];
    return mockStore.getLogs(userId);
  }
};

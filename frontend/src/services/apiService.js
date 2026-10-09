// API Integration Service Layer for MediTrail
// Connects frontend to Node.js / Express / Supabase backend

import { mockStore } from './mockStore';

// Set to true to connect live Node.js / Express backend!
const USE_REAL_BACKEND = true; 

// Default local Express backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiService = {
  // Records
  getRecords: async () => {
    if (!USE_REAL_BACKEND) return mockStore.getRecords();
    try {
      const res = await fetch(`${API_BASE_URL}/records`);
      if (!res.ok) throw new Error('Failed to fetch records');
      return await res.json();
    } catch (e) {
      console.warn('Backend API offline, using fallback store:', e);
      return mockStore.getRecords();
    }
  },

  addRecord: async (recordData) => {
    if (!USE_REAL_BACKEND) return mockStore.addRecord(recordData);
    try {
      const res = await fetch(`${API_BASE_URL}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData)
      });
      if (!res.ok) throw new Error('Failed to create record');
      return await res.json();
    } catch (e) {
      return mockStore.addRecord(recordData);
    }
  },

  deleteRecord: async (id) => {
    if (!USE_REAL_BACKEND) return mockStore.deleteRecord(id);
    try {
      const res = await fetch(`${API_BASE_URL}/records/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete record');
      return await res.json();
    } catch (e) {
      return mockStore.deleteRecord(id);
    }
  },

  // Doctor Sharing
  createShare: async (shareConfig) => {
    if (!USE_REAL_BACKEND) return mockStore.createShare(shareConfig);
    try {
      const res = await fetch(`${API_BASE_URL}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shareConfig)
      });
      if (!res.ok) throw new Error('Failed to create share link');
      return await res.json();
    } catch (e) {
      return mockStore.createShare(shareConfig);
    }
  },

  getShareByToken: async (token) => {
    if (!USE_REAL_BACKEND) return mockStore.getShareByToken(token);
    try {
      const res = await fetch(`${API_BASE_URL}/share/${token}`);
      if (!res.ok) throw new Error('Share link expired or revoked');
      return await res.json();
    } catch (e) {
      return mockStore.getShareByToken(token);
    }
  },

  revokeShare: async (shareId) => {
    if (!USE_REAL_BACKEND) return mockStore.revokeShare(shareId);
    try {
      const res = await fetch(`${API_BASE_URL}/share/${shareId}/revoke`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to revoke access');
      return await res.json();
    } catch (e) {
      return mockStore.revokeShare(shareId);
    }
  },

  // AI Health Summary
  getAISummary: async () => {
    if (!USE_REAL_BACKEND) return mockStore.getAISummary();
    try {
      const res = await fetch(`${API_BASE_URL}/ai/summary`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate AI summary');
      return await res.json();
    } catch (e) {
      return mockStore.getAISummary();
    }
  },

  // Access Security Logs
  getLogs: async () => {
    if (!USE_REAL_BACKEND) return mockStore.getLogs();
    try {
      const res = await fetch(`${API_BASE_URL}/access-logs`);
      if (!res.ok) throw new Error('Failed to fetch access logs');
      return await res.json();
    } catch (e) {
      return mockStore.getLogs();
    }
  }
};

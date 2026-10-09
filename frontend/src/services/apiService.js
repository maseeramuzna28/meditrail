// API Integration Service Layer for MediTrail
// Connects frontend to Node.js / Express / Supabase backend

import { mockStore } from './mockStore';

// Change this to true when your Node.js/Express backend server is running!
const USE_REAL_BACKEND = false; 

// Default local Express backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiService = {
  // Records
  getRecords: async () => {
    if (!USE_REAL_BACKEND) return mockStore.getRecords();
    const res = await fetch(`${API_BASE_URL}/records`);
    if (!res.ok) throw new Error('Failed to fetch records');
    return await res.json();
  },

  addRecord: async (recordData) => {
    if (!USE_REAL_BACKEND) return mockStore.addRecord(recordData);
    const res = await fetch(`${API_BASE_URL}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordData)
    });
    if (!res.ok) throw new Error('Failed to create record');
    return await res.json();
  },

  deleteRecord: async (id) => {
    if (!USE_REAL_BACKEND) return mockStore.deleteRecord(id);
    const res = await fetch(`${API_BASE_URL}/records/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete record');
    return await res.json();
  },

  // Doctor Sharing
  createShare: async (shareConfig) => {
    if (!USE_REAL_BACKEND) return mockStore.createShare(shareConfig);
    const res = await fetch(`${API_BASE_URL}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shareConfig)
    });
    if (!res.ok) throw new Error('Failed to create share link');
    return await res.json();
  },

  getShareByToken: async (token) => {
    if (!USE_REAL_BACKEND) return mockStore.getShareByToken(token);
    const res = await fetch(`${API_BASE_URL}/share/${token}`);
    if (!res.ok) throw new Error('Share link expired or revoked');
    return await res.json();
  },

  revokeShare: async (shareId) => {
    if (!USE_REAL_BACKEND) return mockStore.revokeShare(shareId);
    const res = await fetch(`${API_BASE_URL}/share/${shareId}/revoke`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to revoke access');
    return await res.json();
  },

  // AI Health Summary
  getAISummary: async () => {
    if (!USE_REAL_BACKEND) return mockStore.getAISummary();
    const res = await fetch(`${API_BASE_URL}/ai/summary`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to generate AI summary');
    return await res.json();
  },

  // Access Security Logs
  getLogs: async () => {
    if (!USE_REAL_BACKEND) return mockStore.getLogs();
    const res = await fetch(`${API_BASE_URL}/access-logs`);
    if (!res.ok) throw new Error('Failed to fetch access logs');
    return await res.json();
  }
};

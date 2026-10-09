-- ============================================================
-- MediTrail Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Medical Records Table
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('prescription', 'lab_report', 'diagnosis', 'discharge_summary', 'imaging', 'vaccination', 'other')),
  doctor_hospital TEXT,
  date DATE NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Share Links Table
CREATE TABLE IF NOT EXISTS share_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token UUID NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  record_ids UUID[] NOT NULL,
  doctor_name TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Access Logs Table (Activity History)
CREATE TABLE IF NOT EXISTS access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  share_link_id UUID REFERENCES share_links(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('link_created', 'link_accessed', 'link_revoked', 'link_expired')),
  details TEXT,
  accessed_by_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- Medical Records: only the owner can access
CREATE POLICY "Users can view own records" ON medical_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records" ON medical_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records" ON medical_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own records" ON medical_records
  FOR DELETE USING (auth.uid() = user_id);

-- Share Links: only the owner can manage
CREATE POLICY "Users can view own share links" ON share_links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own share links" ON share_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own share links" ON share_links
  FOR UPDATE USING (auth.uid() = user_id);

-- Access Logs: only the owner can view
CREATE POLICY "Users can view own activity logs" ON access_logs
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- Indexes for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_medical_records_user_id ON medical_records(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_date ON medical_records(date DESC);
CREATE INDEX IF NOT EXISTS idx_medical_records_category ON medical_records(category);
CREATE INDEX IF NOT EXISTS idx_share_links_token ON share_links(token);
CREATE INDEX IF NOT EXISTS idx_share_links_user_id ON share_links(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_share_link_id ON access_logs(share_link_id);

-- ============================================================
-- Supabase Storage Bucket for Medical Files
-- Run this separately if needed
-- ============================================================

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('medical-files', 'medical-files', false);

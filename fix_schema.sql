-- ============================================================
-- MediTrail Schema FIX — Run this in Supabase SQL Editor
-- Fixes category constraint and adds doctor/hospital columns
-- ============================================================

-- 1. Drop the old restrictive category CHECK constraint
ALTER TABLE medical_records DROP CONSTRAINT IF EXISTS medical_records_category_check;

-- 2. Add separate doctor and hospital columns (if they don't exist)
ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS doctor TEXT DEFAULT '';
ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS hospital TEXT DEFAULT '';

-- 3. If doctor_hospital combined column still exists, migrate data and drop it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'medical_records' AND column_name = 'doctor_hospital'
  ) THEN
    -- Copy combined value to doctor column for existing records
    UPDATE medical_records SET doctor = doctor_hospital WHERE doctor IS NULL OR doctor = '';
    ALTER TABLE medical_records DROP COLUMN IF EXISTS doctor_hospital;
  END IF;
END $$;

-- 4. Re-apply RLS policies cleanly
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own records" ON medical_records;
DROP POLICY IF EXISTS "Users can insert own records" ON medical_records;
DROP POLICY IF EXISTS "Users can update own records" ON medical_records;
DROP POLICY IF EXISTS "Users can delete own records" ON medical_records;
DROP POLICY IF EXISTS "Users can view own share links" ON share_links;
DROP POLICY IF EXISTS "Users can insert own share links" ON share_links;
DROP POLICY IF EXISTS "Users can update own share links" ON share_links;
DROP POLICY IF EXISTS "Users can view own activity logs" ON access_logs;

CREATE POLICY "Users can view own records"   ON medical_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records" ON medical_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own records" ON medical_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own records" ON medical_records FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own share links"   ON share_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own share links" ON share_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own share links" ON share_links FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activity logs" ON access_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity logs" ON access_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Recreate indexes
CREATE INDEX IF NOT EXISTS idx_medical_records_user_id  ON medical_records(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_date      ON medical_records(date DESC);
CREATE INDEX IF NOT EXISTS idx_medical_records_category  ON medical_records(category);
CREATE INDEX IF NOT EXISTS idx_share_links_token         ON share_links(token);
CREATE INDEX IF NOT EXISTS idx_share_links_user_id       ON share_links(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id       ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_share_link_id ON access_logs(share_link_id);

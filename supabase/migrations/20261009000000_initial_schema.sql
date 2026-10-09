-- Final Revised Schema for MediTrail

-- Enable UUID extension securely
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types (safe creation for re-runs)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'canceled', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. User Roles (Authorization)
-- Separated from profiles to ensure user-editable profile updates cannot elevate privileges.
CREATE TABLE user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
    role user_role NOT NULL DEFAULT 'patient',
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
COMMENT ON TABLE user_roles IS 'Trusted roles table. Must be managed by a secure server workflow, not client-side updates. Users cannot assign their own roles via RLS.';

-- 2. Profiles Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    contact_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON COLUMN profiles.full_name IS 'Personally Identifiable Information (PII) - requires strict RLS';

-- 3. Doctors Table
CREATE TABLE doctors (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE RESTRICT,
    specialization TEXT NOT NULL,
    license_number TEXT NOT NULL UNIQUE,
    hospital_affiliation TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON COLUMN doctors.is_verified IS 'Set to true only after trusted administrative verification.';

-- 4. Medical Records Table
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    record_date DATE NOT NULL,
    metadata JSONB,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_category CHECK (category IN ('lab_result', 'prescription', 'imaging', 'clinical_note', 'vaccination', 'other'))
);
COMMENT ON COLUMN medical_records.storage_path IS 'Path to private object storage. Ownership enforced by RLS. Never exposes a public URL.';
CREATE INDEX idx_med_records_patient_date ON medical_records(patient_id, record_date DESC);

-- 5. Appointments Table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    scheduled_time TIMESTAMPTZ NOT NULL,
    status appointment_status NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_appointment_time CHECK (scheduled_time > created_at)
);
CREATE INDEX idx_appointments_patient_time ON appointments(patient_id, scheduled_time DESC);
CREATE INDEX idx_appointments_doctor_time ON appointments(doctor_id, scheduled_time DESC);

-- 6. Record Shares Table
CREATE TABLE record_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT expires_in_future CHECK (expires_at > created_at)
);
COMMENT ON TABLE record_shares IS 'Temporal access granted to doctors. Patients alone own the rights to grant/revoke via RLS.';
-- Partial index prevents duplicate active grants while allowing new ones after revocation.
CREATE UNIQUE INDEX unique_active_grant ON record_shares (record_id, doctor_id) WHERE revoked_at IS NULL;

-- 7. Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE audit_logs IS 'Immutable log. Modifying directly via client is disabled. Server uses log_audit_event().';
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Trigger to enforce immutability on audit_logs
CREATE OR REPLACE FUNCTION public.prevent_audit_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs are immutable and cannot be modified or deleted.';
END;
$$;

CREATE TRIGGER trg_audit_logs_immutable
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

-- Trusted function for inserting audit logs bypassing standard RLS
CREATE OR REPLACE FUNCTION public.log_audit_event(
    p_actor_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id UUID,
    p_metadata JSONB DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.audit_logs (actor_id, action, resource_type, resource_id, metadata)
    VALUES (p_actor_id, p_action, p_resource_type, p_resource_id, p_metadata);
END;
$$;
-- Revoke execution from ordinary clients; only trusted service roles can execute
REVOKE EXECUTE ON FUNCTION public.log_audit_event FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.log_audit_event FROM authenticated;
GRANT EXECUTE ON FUNCTION public.log_audit_event TO service_role;
COMMENT ON FUNCTION log_audit_event IS 'Trusted server-side or database-controlled insertion workflow for audit logs.';

-- 8. Consents Table (Append-Only History)
CREATE TABLE consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    purpose TEXT NOT NULL,
    is_granted BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE consents IS 'Append-only history of consent grants and revocations.';
CREATE INDEX idx_consents_patient_purpose ON consents(patient_id, purpose, created_at DESC);

-- Trigger to enforce immutability on consents
CREATE OR REPLACE FUNCTION public.prevent_consent_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RAISE EXCEPTION 'Consent records are append-only and cannot be modified or deleted.';
END;
$$;

CREATE TRIGGER trg_consents_immutable
BEFORE UPDATE OR DELETE ON consents
FOR EACH ROW EXECUTE FUNCTION public.prevent_consent_modification();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

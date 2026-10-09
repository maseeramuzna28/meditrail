-- RLS Policies for MediTrail Schema

-- 1. User Roles
CREATE POLICY "Users can view their own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());
-- No INSERT/UPDATE/DELETE policies, ensuring only service-role can manage roles.

-- 2. Profiles
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Doctors can view shared patient profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.record_shares rs
        JOIN public.medical_records mr ON rs.record_id = mr.id
        WHERE mr.patient_id = profiles.id
          AND rs.doctor_id = auth.uid()
          AND rs.revoked_at IS NULL
          AND rs.expires_at > NOW()
    )
);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF current_user = 'postgres' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' THEN
        RETURN NEW;
    END IF;
    IF NEW.id != OLD.id THEN
        RAISE EXCEPTION 'Cannot modify identity field.';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_fields();

-- 3. Doctors
CREATE POLICY "Authenticated users can view verified doctors"
ON public.doctors FOR SELECT
TO authenticated
USING (is_verified = true OR id = auth.uid());

CREATE POLICY "Doctors can update own profile"
ON public.doctors FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.protect_doctor_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Rely on Postgres role or JWT service_role claim for trusted backend bypass
    IF current_user = 'postgres' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' THEN
        RETURN NEW;
    END IF;
    
    IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
        RAISE EXCEPTION 'Only an administrator can change verification status.';
    END IF;
    IF NEW.id != OLD.id THEN
        RAISE EXCEPTION 'Cannot modify identity field.';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_is_verified_tampering ON public.doctors;
CREATE TRIGGER trg_prevent_is_verified_tampering
BEFORE UPDATE ON public.doctors
FOR EACH ROW EXECUTE FUNCTION public.protect_doctor_verification();

-- 4. Medical Records
CREATE POLICY "Patients can view own records"
ON public.medical_records FOR SELECT
TO authenticated
USING (patient_id = auth.uid());

CREATE POLICY "Patients can insert own records"
ON public.medical_records FOR INSERT
TO authenticated
WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Patients can update own records"
ON public.medical_records FOR UPDATE
TO authenticated
USING (patient_id = auth.uid())
WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Patients can delete own records"
ON public.medical_records FOR DELETE
TO authenticated
USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view shared records"
ON public.medical_records FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.record_shares rs
        WHERE rs.record_id = medical_records.id
          AND rs.doctor_id = auth.uid()
          AND rs.revoked_at IS NULL
          AND rs.expires_at > NOW()
    )
    AND EXISTS (
        SELECT 1 FROM public.doctors d
        WHERE d.id = auth.uid()
          AND d.is_verified = true
    )
);

CREATE OR REPLACE FUNCTION public.protect_medical_records()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF current_user = 'postgres' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' THEN
        RETURN NEW;
    END IF;
    IF NEW.patient_id != OLD.patient_id THEN
        RAISE EXCEPTION 'Cannot reassign patient ownership of a medical record.';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_medical_records ON public.medical_records;
CREATE TRIGGER trg_protect_medical_records
BEFORE UPDATE ON public.medical_records
FOR EACH ROW EXECUTE FUNCTION public.protect_medical_records();

-- 5. Appointments
CREATE POLICY "Patients and Doctors can view own appointments"
ON public.appointments FOR SELECT
TO authenticated
USING (patient_id = auth.uid() OR doctor_id = auth.uid());

CREATE POLICY "Patients can schedule appointments"
ON public.appointments FOR INSERT
TO authenticated
WITH CHECK (
    patient_id = auth.uid() 
    AND status = 'scheduled'
    AND EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND is_verified = true)
);

CREATE POLICY "Participants can update appointments"
ON public.appointments FOR UPDATE
TO authenticated
USING (patient_id = auth.uid() OR doctor_id = auth.uid())
WITH CHECK (patient_id = auth.uid() OR doctor_id = auth.uid());

CREATE OR REPLACE FUNCTION public.protect_appointments()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF current_user = 'postgres' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' THEN
        RETURN NEW;
    END IF;
    IF NEW.patient_id != OLD.patient_id OR NEW.doctor_id != OLD.doctor_id THEN
        RAISE EXCEPTION 'Cannot reassign patient or doctor for an appointment.';
    END IF;
    -- Restrict valid transitions if necessary (can be offloaded to RPC for strict workflow)
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_appointments ON public.appointments;
CREATE TRIGGER trg_protect_appointments
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.protect_appointments();


-- 6. Record Shares
CREATE POLICY "Patients can view shares for their records"
ON public.record_shares FOR SELECT
TO authenticated
USING (record_id IN (SELECT id FROM public.medical_records WHERE patient_id = auth.uid()));

CREATE POLICY "Doctors can view shares assigned to them"
ON public.record_shares FOR SELECT
TO authenticated
USING (doctor_id = auth.uid());

CREATE POLICY "Patients can create shares"
ON public.record_shares FOR INSERT
TO authenticated
WITH CHECK (
    record_id IN (SELECT id FROM public.medical_records WHERE patient_id = auth.uid())
    AND EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND is_verified = true)
    AND revoked_at IS NULL
);

CREATE POLICY "Patients can revoke shares"
ON public.record_shares FOR UPDATE
TO authenticated
USING (record_id IN (SELECT id FROM public.medical_records WHERE patient_id = auth.uid()))
WITH CHECK (record_id IN (SELECT id FROM public.medical_records WHERE patient_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.protect_record_shares()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF current_user = 'postgres' OR current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' THEN
        RETURN NEW;
    END IF;
    IF NEW.record_id != OLD.record_id OR NEW.doctor_id != OLD.doctor_id THEN
        RAISE EXCEPTION 'Cannot modify record or doctor on an existing share.';
    END IF;
    IF NEW.expires_at != OLD.expires_at THEN
        RAISE EXCEPTION 'Cannot modify expiration on an existing share. Revoke and recreate instead.';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_record_shares ON public.record_shares;
CREATE TRIGGER trg_protect_record_shares
BEFORE UPDATE ON public.record_shares
FOR EACH ROW EXECUTE FUNCTION public.protect_record_shares();

-- 7. Audit Logs
CREATE POLICY "Users can view own audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (actor_id = auth.uid());
-- Insertion is handled by SECURITY DEFINER function `log_audit_event` via the backend.
-- Updating/Deleting is blocked globally by the trigger in the schema.

-- 8. Consents
CREATE POLICY "Patients can view own consents"
ON public.consents FOR SELECT
TO authenticated
USING (patient_id = auth.uid());

CREATE POLICY "Patients can insert consents"
ON public.consents FOR INSERT
TO authenticated
WITH CHECK (patient_id = auth.uid());
-- Updating/Deleting is blocked globally by the trigger in the schema.

-- 9. Storage Buckets and Object Policies
-- Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical_documents', 'medical_documents', false)
ON CONFLICT (id) DO NOTHING;

-- Patients can upload files, but ONLY into a folder matching their auth.uid()
CREATE POLICY "Patients can upload medical files to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'medical_documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Patients can view files in their own folder
CREATE POLICY "Patients can view own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'medical_documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Doctors can view files if they have a valid share pointing to that exact storage_path
CREATE POLICY "Doctors can view shared files"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'medical_documents'
    AND EXISTS (
        SELECT 1 FROM public.medical_records mr
        JOIN public.record_shares rs ON mr.id = rs.record_id
        WHERE mr.storage_path = name
          AND rs.doctor_id = auth.uid()
          AND rs.revoked_at IS NULL
          AND rs.expires_at > NOW()
    )
    AND EXISTS (
        SELECT 1 FROM public.doctors d
        WHERE d.id = auth.uid()
          AND d.is_verified = true
    )
);

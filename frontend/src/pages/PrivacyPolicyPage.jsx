import React from 'react';
import { Shield, Lock, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="inline-flex items-center space-x-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-4 h-4 text-teal-600" />
          <span>Patient Data Sovereignty</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy & Data Security</h1>
        <p className="text-xs text-slate-500">Last updated: October 2026 • Effective Version 1.0</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Patient Control & Ownership</h2>
          <p>
            At MediTrail, we operate on a fundamental principle: <strong>Your medical history belongs exclusively to you.</strong> We do not claim ownership of any uploaded medical records, prescriptions, diagnostic lab reports, or health summaries.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Time-Bound Doctor Sharing</h2>
          <p>
            When you generate a doctor share link or QR code, access is granted strictly to the individual records you select. Doctor tokens are protected by cryptographic authorization and automatically expire after your chosen duration (1 hour, 24 hours, or 7 days). You retain the right to click <strong>[Revoke Access]</strong> at any point to terminate doctor access immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. End-to-End Encryption & Security</h2>
          <p>
            All document uploads and clinical summary data are encrypted in transit via TLS 1.3 and at rest using AES-256 standards. Access logs are recorded in a tamper-evident audit trail available for inspection under your account dashboard.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">4. Zero Data Selling</h2>
          <p>
            We will never monetize, sell, trade, or share your health records, personal data, or clinical metadata with third-party advertisers, insurance companies, or data brokers.
          </p>
        </section>

      </div>

    </div>
  );
}

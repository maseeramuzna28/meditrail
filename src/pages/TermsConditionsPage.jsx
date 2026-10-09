import React from 'react';
import { FileText, ShieldAlert } from 'lucide-react';

export default function TermsConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="inline-flex items-center space-x-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-4 h-4 text-teal-600" />
          <span>Terms of Service</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Terms & Conditions</h1>
        <p className="text-xs text-slate-500">Last updated: October 2026</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the MediTrail platform, you agree to comply with and be bound by these Terms of Service. MediTrail provides a digital vault for organizing, summarizing, and sharing patient health records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">2. Medical Disclaimer</h2>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 space-y-1 text-xs">
            <span className="font-bold flex items-center space-x-1">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Not a Substitute for Medical Advice</span>
            </span>
            <p>
              MediTrail and its AI health summary tools provide informational summaries extracted from existing documents. MediTrail does not diagnose conditions, prescribe medications, or replace licensed medical professionals.
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">3. User Responsibility</h2>
          <p>
            You are responsible for ensuring the accuracy of records you upload and for managing access links shared with consulting practitioners.
          </p>
        </section>

      </div>

    </div>
  );
}

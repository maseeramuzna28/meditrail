import React from 'react';
import { 
  Shield, 
  Lock, 
  Share2, 
  FileText, 
  Clock, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  EyeOff,
  UserCheck,
  Stethoscope
} from 'lucide-react';

export default function LandingPage({ setActivePage, onDemoLogin }) {
  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-teal-50/60 via-white to-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-teal-100/70 border border-teal-200 text-teal-800 text-xs font-semibold">
                <Shield className="w-4 h-4 text-teal-700" />
                <span>Patient-Controlled Digital Medical Records</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Your Medical History. <br />
                <span className="text-teal-600">One Secure Trail.</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Prescriptions, lab reports, diagnoses, and discharge summaries scattered across different clinics? 
                MediTrail consolidates your complete health records into a single, encrypted vault. You decide exactly what your doctor sees.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <button
                  onClick={onDemoLogin}
                  className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Enter Patient Vault (Interactive Demo)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActivePage('signup')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Create Free Account</span>
                </button>
              </div>

              {/* Trust Callouts */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/80 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>100% Patient Control</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Time-Bound Doctor Links</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Full Security Audit Log</span>
                </div>
              </div>

            </div>

            {/* Right Graphic Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">meditrail.org/vault</span>
                </div>

                {/* Card Preview Item */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-800 font-semibold rounded-md">Lab Report</span>
                    <span className="text-slate-400">08 OCT 2026</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Blood Panel & Lipid Profile</h4>
                  <p className="text-xs text-slate-500">Apex Diagnostics • Dr. Sarah Jenkins</p>
                </div>

                {/* Doctor Sharing Box */}
                <div className="bg-teal-900 text-white p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-teal-300">
                      <Lock className="w-4 h-4" />
                      <span className="text-xs font-bold">Active Doctor Share</span>
                    </div>
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">23h 42m Left</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Shared 2 specific records with <strong className="text-white">Dr. Ahmed Khan</strong>
                  </div>
                  <button
                    onClick={onDemoLogin}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>View Doctor Portal Simulation</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Value Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-bold text-teal-700 uppercase tracking-widest">How MediTrail Works</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">Patient Data Sovereignty in 4 Simple Steps</h3>
          <p className="text-slate-600 text-sm">
            You should never have to manually track down paper prescriptions or email medical PDFs to unknown portals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">1. Store Records</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload prescriptions, lab tests, diagnoses, and discharge certificates into one unified vault.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">2. Visual Timeline</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Organize your entire medical history chronologically so you can see past treatments instantly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">3. AI Health Summary</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get an instant summary of conditions, active medications, and allergies extracted strictly from existing records.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">4. Selective Sharing</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select specific records to share with a doctor via a temporary link or QR code, then revoke access anytime.
            </p>
          </div>

        </div>
      </section>

      {/* Security & Access Protection Guarantee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 text-teal-400 text-xs font-semibold bg-slate-800 px-3 py-1 rounded-md border border-slate-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Unwanted Access</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold">A Doctor Should Only See What You Choose to Share.</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
              Unlike legacy hospital systems that expose your entire lifelong record, MediTrail lets you select individual documents. Set 1-hour or 24-hour expiration, or click [Revoke Access] to immediately block doctor access.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Time-Bound QR Code</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Real-Time Revocation</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Audit Access Log</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <button
              onClick={onDemoLogin}
              className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-2xl shadow-lg transition-all text-center"
            >
              Launch Interactive Demo
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}

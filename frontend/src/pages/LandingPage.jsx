import React from 'react';
import { 
  Shield, 
  Lock, 
  Share2, 
  FileText, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  QrCode, 
  Ban, 
  Activity,
  HeartPulse,
  Eye,
  Stethoscope,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function LandingPage({ setActivePage }) {
  const demoFlowSteps = [
    { num: '01', title: 'Patient Signs In', desc: 'Access your private, encrypted medical command center.', icon: ShieldCheck },
    { num: '02', title: 'Upload & Vault', desc: 'Consolidate prescriptions, lab reports, and hospital records.', icon: FileText },
    { num: '03', title: 'Medical Timeline', desc: 'Automatically map clinical history into a chronological journey.', icon: Clock },
    { num: '04', title: 'AI Clinical Summary', desc: 'Instant synthesized overview with strict medical disclaimers.', icon: Sparkles },
    { num: '05', title: 'Selective Doctor Share', desc: 'Choose ONLY the records the doctor needs to review.', icon: Share2 },
    { num: '06', title: 'QR Code & Expiry', desc: 'Generate single-use temporary link with automatic expiry.', icon: QrCode },
    { num: '07', title: 'Revoke Access', desc: 'Instant patient revocation locks out doctor view at any time.', icon: Ban },
    { num: '08', title: 'Audit Trail', desc: 'Tamper-evident activity log of every access and view.', icon: Activity }
  ];

  return (
    <div className="bg-slate-50 text-slate-900 space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold shadow-xs">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            <span>HealthTech Hackathon · Patient Data Sovereignty</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Your Medical History. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-sky-600">
              One Secure Trail.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            MediTrail brings your scattered prescriptions, lab tests, diagnoses, and hospital discharge summaries into a unified patient-controlled platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActivePage('signup')}
              className="w-full sm:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActivePage('login')}
              className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold rounded-xl shadow-xs transition-colors"
            >
              Patient Sign In
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Patient Always Controls Sharing
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Selective Doctor Permission
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Instant Access Revocation
            </span>
          </div>

        </div>

        {/* Hero Interactive UI Card Mockup */}
        <div className="mt-12 max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <span className="ml-2 font-mono text-slate-500 font-semibold">meditrail.org/dashboard</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              ● Live Demo Environment
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Patient Overview</span>
                <h3 className="text-xl font-bold text-slate-900">Dr. Ahmed's Cardiology Consult</h3>
                <p className="text-xs text-slate-500">2 specific medical records selected for 24-hour review</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-mono font-bold">
                  ⏱ Expires: 23h 42m
                </span>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                  Patient Can Revoke
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/20 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                  Shared Record 1
                </span>
                <h4 className="text-sm font-bold text-slate-900 pt-1">Comprehensive Blood Panel & Lipid Profile</h4>
                <p className="text-xs text-slate-500">Apex Health Diagnostics · 08 Oct 2026</p>
              </div>

              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  Shared Record 2
                </span>
                <h4 className="text-sm font-bold text-slate-900 pt-1">Hypertension & Vitamin Supplement Prescription</h4>
                <p className="text-xs text-slate-500">Dr. Ahmed Khan · 25 Sep 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 8-Step Hackathon Demo Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700">
            Hackathon Presentation Story
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How MediTrail Solves Patient Data Fragmentation
          </h2>
          <p className="text-xs text-slate-500">
            Step-by-step demonstration of patient sovereignty, selective doctor authorization, and instant revocation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {demoFlowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Step {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  {step.title}
                </h3>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900">Built for Trust & Precision</h2>
            <p className="text-xs text-slate-500">Modern healthcare infrastructure designed for patient empowerment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Medical Timeline</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transform loose clinical documents into a connected chronological narrative that tells your health story clearly.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Health Summary</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Synthesize medications, conditions, and diagnostic trends without hallucinations, bounded strictly by medical disclaimers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Doctor Access Control</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Doctors only see the specific records you authorize. Set custom expiration windows or revoke with a single click.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

import React from 'react';
import { 
  FileText, 
  Clock, 
  Sparkles, 
  Share2, 
  Upload, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2,
  Calendar,
  AlertTriangle,
  HeartPulse,
  ChevronRight,
  Activity
} from 'lucide-react';
import RecordCard from '../components/RecordCard';

export default function DashboardPage({ 
  records = [], 
  shares = [], 
  onOpenUpload, 
  setActivePage,
  onViewRecord,
  onOpenShareModal,
  user
}) {
  const activeShares = shares.filter(s => s.status === 'active');
  const recentRecords = records.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Patient Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background texture */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <HeartPulse className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/60 border border-teal-500/40 text-teal-100 text-xs font-semibold backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            <span>Patient-Controlled Digital Medical Records</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, {user?.name || 'Patient'}
          </h1>
          
          <p className="text-sm text-teal-100/90 leading-relaxed">
            Your personal health records are unified, organized chronologically, and encrypted. You control exactly who can view your data, and you can revoke access at any time.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-teal-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              AES-256 Vault Encryption
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Zero Third-Party Sharing
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Instant Doctor Revocation
            </span>
          </div>
        </div>
      </div>

      {/* Primary 4 Quick Actions (Strictly Per MediTrail Specifications) */}
      <div>
        <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Action 1: Upload Record */}
          <button
            onClick={onOpenUpload}
            className="group p-5 bg-white border border-slate-200 hover:border-sky-300 rounded-xl shadow-sm hover:shadow-md transition-all text-left flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors pt-2">
                Upload Record
              </h3>
              <p className="text-xs text-slate-500">
                Prescription, Lab report, or PDF document
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all mt-1" />
          </button>

          {/* Action 2: View Timeline */}
          <button
            onClick={() => setActivePage('timeline')}
            className="group p-5 bg-white border border-slate-200 hover:border-teal-300 rounded-xl shadow-sm hover:shadow-md transition-all text-left flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors pt-2">
                View Timeline
              </h3>
              <p className="text-xs text-slate-500">
                Chronological journey of your health events
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all mt-1" />
          </button>

          {/* Action 3: AI Health Summary */}
          <button
            onClick={() => setActivePage('ai-summary')}
            className="group p-5 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl shadow-sm hover:shadow-md transition-all text-left flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors pt-2">
                AI Health Summary
              </h3>
              <p className="text-xs text-slate-500">
                Synthesized review from your medical files
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-700 group-hover:translate-x-1 transition-all mt-1" />
          </button>

          {/* Action 4: Share With Doctor */}
          <button
            onClick={onOpenShareModal}
            className="group p-5 bg-white border border-slate-200 hover:border-teal-400 rounded-xl shadow-sm hover:shadow-md transition-all text-left flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 border border-teal-200 flex items-center justify-center group-hover:bg-teal-800 group-hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors pt-2">
                Share With Doctor
              </h3>
              <p className="text-xs text-slate-500">
                Create temporary link or QR with selective access
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-800 group-hover:translate-x-1 transition-all mt-1" />
          </button>

        </div>
      </div>

      {/* Key Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Total Records */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Records In Vault</span>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{records.length}</h3>
            <p className="text-xs text-teal-700 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              All records secured
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Active Doctor Shares */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Doctor Shares</span>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{activeShares.length}</h3>
            <button 
              onClick={() => setActivePage('active-shares')}
              className="text-xs text-sky-700 font-semibold hover:underline mt-1 flex items-center gap-1"
            >
              <span>Manage active links</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        {/* Access History */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Security & Audit Log</span>
            <h3 className="text-sm font-bold text-slate-900 mt-1">Tamper-Evident History</h3>
            <button 
              onClick={() => setActivePage('activity')}
              className="text-xs text-teal-700 font-semibold hover:underline mt-1 flex items-center gap-1"
            >
              <span>Review audit trail</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Recent Records Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Medical Records</h2>
            <p className="text-xs text-slate-500">Your latest uploaded clinical documents</p>
          </div>
          <button
            onClick={() => setActivePage('vault')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All ({records.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {records.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Your Medical Vault is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload your prescriptions, blood tests, or hospital discharge papers to build your secure trail.
            </p>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Upload First Record
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentRecords.map(record => (
              <RecordCard 
                key={record.id} 
                record={record} 
                onView={onViewRecord}
                onShare={() => onOpenShareModal && onOpenShareModal(record.id)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

import React from 'react';
import { Share2, Lock, ShieldCheck, QrCode, ArrowRight, UserCheck } from 'lucide-react';

export default function ShareRecordsPage({ onOpenShareModal, setActivePage, activeShares = [] }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center space-x-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Share2 className="w-4 h-4 text-teal-600" />
          <span>Patient Data Sovereignty</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Doctor Access Control Hub</h1>
        <p className="text-xs text-slate-500">
          Create temporary, encrypted links or QR codes for your consulting doctor. Revoke anytime.
        </p>
      </div>

      {/* Primary Action Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        <div className="md:col-span-8 space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-md text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Strict Record Isolation</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Choose Exactly What Your Doctor Sees</h2>
          <p className="text-slate-600 text-xs leading-relaxed max-w-lg">
            Instead of handing over your complete medical history, select only the blood report or prescription relevant to your visit.
          </p>
          <button
            onClick={() => onOpenShareModal()}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center space-x-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Create New Temporary Doctor Share</span>
          </button>
        </div>

        <div className="md:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold mx-auto">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Active Share Links</h3>
          <p className="text-2xl font-extrabold text-teal-600">{activeShares.length}</p>
          <button
            onClick={() => setActivePage('active-shares')}
            className="text-xs text-teal-700 hover:underline font-semibold flex items-center justify-center space-x-1 mx-auto"
          >
            <span>Manage Active Tokens</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}

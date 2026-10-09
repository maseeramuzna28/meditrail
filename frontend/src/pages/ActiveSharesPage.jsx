import React from 'react';
import { 
  Lock, 
  Clock, 
  ShieldAlert, 
  Ban, 
  ExternalLink, 
  UserCheck, 
  FileText,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';

export default function ActiveSharesPage({ shares = [], onRevokeShare, onOpenDoctorPortal }) {
  
  // Calculate remaining time string
  const getRemainingTime = (expiresAt) => {
    const diff = new Date(expiresAt) - new Date();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 3600));
    const mins = Math.floor((diff % (1000 * 3600)) / (1000 * 60));
    return `${hours}h ${mins}m remaining`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center space-x-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Lock className="w-4 h-4 text-teal-600" />
          <span>Active Doctor Authorizations</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Active Shares & Access Control</h1>
        <p className="text-xs text-slate-500">
          Monitor which medical professionals currently have access to your records and revoke access anytime
        </p>
      </div>

      {/* Shares List */}
      {shares.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <Lock className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Active Doctor Shares</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You have not generated any temporary share links. When you share records with a doctor, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {shares.map(share => {
            const isRevoked = share.status === 'revoked';
            const isExpired = share.status === 'expired' || new Date(share.expiresAt) < new Date();
            const isActive = share.status === 'active' && !isExpired;

            return (
              <div 
                key={share.id}
                className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                  isActive ? 'border-teal-200 ring-1 ring-teal-500/20' : 'border-slate-200 opacity-80'
                }`}
              >
                
                {/* Doctor & Record Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-slate-900">{share.doctorName}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 font-semibold rounded-md">
                      {share.specialty || 'General Practice'}
                    </span>
                    
                    {/* Status Pill */}
                    {isActive && (
                      <span className="text-xs px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Active</span>
                      </span>
                    )}
                    {isRevoked && (
                      <span className="text-xs px-2.5 py-0.5 bg-rose-100 text-rose-800 font-bold rounded-md flex items-center space-x-1">
                        <Ban className="w-3.5 h-3.5 text-rose-600" />
                        <span>Access Revoked</span>
                      </span>
                    )}
                    {isExpired && !isRevoked && (
                      <span className="text-xs px-2.5 py-0.5 bg-slate-200 text-slate-700 font-bold rounded-md">
                        Expired
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{share.recordIds.length} Record(s) Shared</span>
                    </span>
                    
                    <span className="flex items-center space-x-1 font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isActive ? getRemainingTime(share.expiresAt) : 'Access Ended'}</span>
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-slate-400">
                    Token: {share.token} • Created: {new Date(share.createdDate).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={() => onOpenDoctorPortal(share.token)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5"
                    title="Simulate doctor opening link"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                    <span>View Doctor Portal</span>
                  </button>

                  {isActive && (
                    <button
                      onClick={() => onRevokeShare(share.id)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
                    >
                      <Ban className="w-4 h-4" />
                      <span>Revoke Access</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

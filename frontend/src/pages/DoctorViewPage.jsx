import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Lock, 
  FileText, 
  Ban, 
  User, 
  Calendar, 
  Building2, 
  Eye, 
  AlertTriangle,
  Stethoscope,
  HeartPulse,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { apiService } from '../services/apiService';
import DocumentViewerModal from '../components/DocumentViewerModal';

export default function DoctorViewPage({ token, onBackToApp }) {
  const [shareData, setShareData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    async function loadSharedRecords() {
      setLoading(true);
      try {
        const data = await apiService.getSharedRecordsByToken(token);
        setShareData(data);
      } catch (err) {
        console.error('Failed to load shared records:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSharedRecords();
  }, [token]);

  // Live countdown timer for the doctor's session
  useEffect(() => {
    if (!shareData?.expiresAt) return;

    const updateTimer = () => {
      const diff = new Date(shareData.expiresAt) - new Date();
      if (diff <= 0) {
        setRemainingTime('Expired');
        return;
      }
      const hours = Math.floor(diff / (1000 * 3600));
      const mins = Math.floor((diff % (1000 * 3600)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setRemainingTime(`${hours}h ${mins}m ${secs}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [shareData?.expiresAt]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto animate-pulse">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Verifying Temporary Medical Authorization...</h3>
          <p className="text-xs text-slate-400 font-mono">Token: {token || 'Validating...'}</p>
        </div>
      </div>
    );
  }

  // ACCESS REVOKED STATE
  if (shareData?.status === 'revoked') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-8 shadow-md text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <Ban className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Access Revoked by Patient</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              The patient has manually revoked access to these medical records. Under MediTrail's patient consent policy, this link is permanently terminated.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-500">
            Token Status: REVOKED · Timestamp: {new Date().toLocaleTimeString()}
          </div>
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              Return to Patient Portal
            </button>
          )}
        </div>
      </div>
    );
  }

  // ACCESS EXPIRED STATE
  if (shareData?.status === 'expired' || remainingTime === 'Expired') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-amber-200 rounded-2xl p-8 shadow-md text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Medical Share Link Expired</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              This temporary access link has passed its designated expiry window. Please request the patient to generate a new secure link.
            </p>
          </div>
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              Return to Patient Portal
            </button>
          )}
        </div>
      </div>
    );
  }

  const records = shareData?.records || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Doctor Header Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">Patient Medical Records</h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  Doctor Review Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Authorized Physician: <strong>{shareData?.doctorName || 'Consulting Physician'}</strong> ({shareData?.specialty || 'Clinical Review'})</span>
              </p>
            </div>
          </div>

          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 self-start sm:self-auto"
            >
              ← Back to App
            </button>
          )}
        </div>

        {/* Security & Expiry Pill Banner (Strictly per prompt specification) */}
        <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-emerald-50 border border-teal-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-teal-900 font-semibold">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span>🔐 Securely shared by patient · Scoped clinical authorization</span>
          </div>

          <div className="flex items-center gap-2 font-mono font-bold text-amber-800 bg-amber-100/70 border border-amber-200 px-3 py-1 rounded-md self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>⏱ Access expires in: {remainingTime || '23h 42m'}</span>
          </div>
        </div>

        {/* Notice of Scoped Access */}
        <div className="text-xs text-slate-500 bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>You have access to <strong>{records.length}</strong> patient-selected record(s). Unshared patient history remains strictly confidential.</span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">Token: {token}</span>
        </div>

        {/* Shared Records List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-500">
            Shared Records ({records.length})
          </h2>

          {records.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-2">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No records attached to this share link.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map(record => (
                <div 
                  key={record.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                        {record.category}
                      </span>
                      <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {record.date}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {record.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      {record.doctor && <span>Physician: <strong className="text-slate-700">{record.doctor}</strong></span>}
                      {record.hospital && <span>Facility: <strong className="text-slate-700">{record.hospital}</strong></span>}
                    </div>

                    {record.description && (
                      <p className="text-xs text-slate-600 pt-1 line-clamp-2">
                        {record.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setViewingRecord(record)}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Record</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        record={viewingRecord}
        isOpen={!!viewingRecord}
        onClose={() => setViewingRecord(null)}
      />
    </div>
  );
}

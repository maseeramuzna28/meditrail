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
  CheckCircle2, 
  Eye, 
  AlertOctagon,
  ArrowLeft,
  Stethoscope
} from 'lucide-react';
import DocumentViewerModal from '../components/DocumentViewerModal';

export default function DoctorViewPage({ token, getShareByToken, allRecords = [], onBackToPatientPortal }) {
  const [share, setShare] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (token) {
      const shareData = getShareByToken(token);
      setShare(shareData);
    }
  }, [token, getShareByToken]);

  // Update countdown timer
  useEffect(() => {
    if (!share || share.status !== 'active') return;

    const interval = setInterval(() => {
      const diff = new Date(share.expiresAt) - new Date();
      if (diff <= 0) {
        setShare(prev => ({ ...prev, status: 'expired' }));
        setTimeLeft('Expired');
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 3600));
        const mins = Math.floor((diff % (1000 * 3600)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [share]);

  if (!share) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Invalid Share Link Token</h2>
        <p className="text-xs text-slate-500">The share link token standard format was not recognized or has expired.</p>
        <button
          onClick={onBackToPatientPortal}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
        >
          Return to Patient Vault Portal
        </button>
      </div>
    );
  }

  // Handle Revoked or Expired States
  if (share.status === 'revoked' || share.status === 'expired') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white border border-rose-200 rounded-3xl p-8 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto font-bold">
            <Ban className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-extrabold rounded-md uppercase tracking-wider">
              {share.status === 'revoked' ? 'Access Revoked' : 'Share Expired'}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">Medical Record Access Unavailable</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {share.status === 'revoked' 
                ? `Access to these medical records was explicitly revoked by the patient (${share.doctorName}).`
                : 'The time-bound temporary share duration has expired.'
              }
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 max-w-sm mx-auto space-y-1">
            <p className="font-semibold text-slate-700">Patient Security Guarantee</p>
            <p>MediTrail ensures patients maintain 100% data sovereignty. Once revoked, no further access is permitted.</p>
          </div>

          <div className="pt-2">
            <button
              onClick={onBackToPatientPortal}
              className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Patient Vault</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Share View
  const sharedRecords = allRecords.filter(r => share.recordIds.includes(r.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">MediTrail Doctor Portal</span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Clinical Patient Record Share</h1>
            </div>
          </div>

          <button
            onClick={onBackToPatientPortal}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center space-x-1.5 w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Patient Vault View</span>
          </button>
        </div>

        {/* Security & Expiry Metadata Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
            <span className="text-slate-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Authorization Status</span>
            </span>
            <p className="text-white font-bold">Securely Shared by Patient</p>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
            <span className="text-slate-400 flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span>Assigned Consulting Physician</span>
            </span>
            <p className="text-white font-bold">{share.doctorName} ({share.specialty || 'Cardiology'})</p>
          </div>

          <div className="bg-amber-900/40 p-3.5 rounded-xl border border-amber-700/60 space-y-1">
            <span className="text-amber-300 flex items-center space-x-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Time-Bound Countdown</span>
            </span>
            <p className="text-amber-200 font-mono font-bold text-sm">
              ⏱ Access expires in: {timeLeft || getRemainingTime(share.expiresAt)}
            </p>
          </div>

        </div>

      </div>

      {/* Shared Records List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Patient-Selected Medical Records ({sharedRecords.length})
          </h2>
          <span className="text-xs text-slate-500">Only authorized documents are visible below</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sharedRecords.map(record => (
            <div key={record.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-md text-xs font-semibold">
                  {record.category}
                </span>
                <span className="text-xs font-mono text-slate-400">{record.date}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{record.title}</h3>

              <div className="space-y-1 text-xs text-slate-500">
                <p><strong className="text-slate-700">Practitioner:</strong> {record.doctor}</p>
                <p><strong className="text-slate-700">Facility:</strong> {record.hospital}</p>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {record.description}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs font-mono text-teal-600 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Encrypted Patient Record</span>
                </span>

                <button
                  onClick={() => setSelectedDoc(record)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Document</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <DocumentViewerModal
          record={selectedDoc}
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onShareRecord={() => {}}
        />
      )}

    </div>
  );
}

function getRemainingTime(expiresAt) {
  const diff = new Date(expiresAt) - new Date();
  if (diff <= 0) return 'Expired';
  const hours = Math.floor(diff / (1000 * 3600));
  const mins = Math.floor((diff % (1000 * 3600)) / (1000 * 60));
  return `${hours}h ${mins}m`;
}

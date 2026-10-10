import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  QrCode,
  Lock,
  Stethoscope,
  CheckCircle2
} from 'lucide-react';

export default function QRCodeModal({ shareData, isOpen, onClose, onOpenDoctorPortal }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !shareData) return null;

  const shareUrl = `${window.location.origin}/doctor/${shareData.token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG QR Code rendering (crisp, vector, no external dependency)
  const renderSvgQr = () => (
    <svg className="w-44 h-44 mx-auto" viewBox="0 0 100 100" fill="currentColor">
      {/* Outer framing squares */}
      <rect x="5" y="5" width="26" height="26" rx="3" fill="#0f172a" />
      <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
      <rect x="13" y="13" width="10" height="10" rx="1.5" fill="#0f766e" />

      <rect x="69" y="5" width="26" height="26" rx="3" fill="#0f172a" />
      <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
      <rect x="77" y="13" width="10" height="10" rx="1.5" fill="#0f766e" />

      <rect x="5" y="69" width="26" height="26" rx="3" fill="#0f172a" />
      <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
      <rect x="13" y="77" width="10" height="10" rx="1.5" fill="#0f766e" />

      {/* Simulated data matrix cells */}
      <rect x="36" y="8" width="5" height="5" rx="1" fill="#0f172a" />
      <rect x="46" y="8" width="5" height="5" rx="1" fill="#0f766e" />
      <rect x="56" y="8" width="5" height="5" rx="1" fill="#0f172a" />

      <rect x="36" y="18" width="5" height="5" rx="1" fill="#0f766e" />
      <rect x="46" y="18" width="10" height="5" rx="1" fill="#0f172a" />

      <rect x="8" y="36" width="5" height="5" rx="1" fill="#0f172a" />
      <rect x="18" y="36" width="5" height="5" rx="1" fill="#0f766e" />
      <rect x="28" y="36" width="5" height="5" rx="1" fill="#0f172a" />

      {/* Center lock emblem */}
      <rect x="42" y="42" width="16" height="16" rx="3" fill="#0f766e" />
      <rect x="46" y="46" width="8" height="8" rx="1.5" fill="#ffffff" />

      <rect x="66" y="36" width="8" height="5" rx="1" fill="#0f172a" />
      <rect x="78" y="36" width="5" height="5" rx="1" fill="#0f766e" />
      <rect x="88" y="36" width="5" height="5" rx="1" fill="#0f172a" />

      <rect x="36" y="66" width="8" height="8" rx="1" fill="#0f766e" />
      <rect x="48" y="66" width="5" height="5" rx="1" fill="#0f172a" />
      <rect x="58" y="66" width="6" height="6" rx="1" fill="#0f766e" />

      <rect x="36" y="78" width="5" height="10" rx="1" fill="#0f172a" />
      <rect x="48" y="78" width="10" height="5" rx="1" fill="#0f766e" />
      <rect x="68" y="78" width="14" height="10" rx="1" fill="#0f172a" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Doctor Access Generated</h3>
              <p className="text-[11px] text-teal-700 font-medium">Temporary Authorization Active</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor & Record Overview Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">{shareData.doctorName}</span>
            <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-semibold text-[10px]">
              {shareData.recordIds?.length || 0} Record(s) Shared
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Expires in: <strong>{new Date(shareData.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</strong></span>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="bg-white border-2 border-dashed border-teal-200 rounded-2xl p-5 text-center shadow-xs">
          {renderSvgQr()}
          <p className="text-xs font-semibold text-slate-700 mt-3">
            Scan to Open in Clinical Viewer
          </p>
          <p className="text-[10px] text-slate-400">
            Encrypted with single-use session token
          </p>
        </div>

        {/* Copyable Share Link Input */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold font-mono text-slate-500 uppercase tracking-wider">
            Secure Share URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-700 select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Action Button: Simulate Doctor View (Hackathon Demo Shortcut) */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
          >
            Done
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenDoctorPortal) onOpenDoctorPortal(shareData.token);
            }}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Doctor Portal (Demo)</span>
          </button>
        </div>

      </div>
    </div>
  );
}

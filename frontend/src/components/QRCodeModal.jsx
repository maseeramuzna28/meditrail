import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ShieldCheck, Clock, QrCode } from 'lucide-react';

export default function QRCodeModal({ shareData, isOpen, onClose, onOpenDoctorPortal }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !shareData) return null;

  const shareUrl = `${window.location.origin}/share/${shareData.token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to generate a clean, realistic SVG QR code pattern
  const renderMockQRCode = () => (
    <div className="w-48 h-48 bg-white p-3 border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center relative group">
      <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Corner Position Detection Patterns */}
        <rect x="5" y="5" width="25" height="25" fill="#0f172a" rx="4"/>
        <rect x="10" y="10" width="15" height="15" fill="white" rx="2"/>
        <rect x="14" y="14" width="7" height="7" fill="#0d9488" rx="1"/>

        <rect x="70" y="5" width="25" height="25" fill="#0f172a" rx="4"/>
        <rect x="75" y="10" width="15" height="15" fill="white" rx="2"/>
        <rect x="79" y="14" width="7" height="7" fill="#0d9488" rx="1"/>

        <rect x="5" y="70" width="25" height="25" fill="#0f172a" rx="4"/>
        <rect x="10" y="75" width="15" height="15" fill="white" rx="2"/>
        <rect x="14" y="79" width="7" height="7" fill="#0d9488" rx="1"/>

        {/* Data Matrix Dots */}
        <rect x="36" y="8" width="6" height="6" fill="#0f172a"/>
        <rect x="48" y="8" width="6" height="6" fill="#0d9488"/>
        <rect x="56" y="8" width="6" height="6" fill="#0f172a"/>

        <rect x="36" y="20" width="6" height="6" fill="#0d9488"/>
        <rect x="44" y="20" width="6" height="6" fill="#0f172a"/>
        <rect x="56" y="20" width="6" height="6" fill="#0d9488"/>

        <rect x="8" y="36" width="6" height="6" fill="#0f172a"/>
        <rect x="20" y="36" width="6" height="6" fill="#0d9488"/>
        <rect x="36" y="36" width="10" height="10" fill="#0d9488" rx="2"/>
        <rect x="52" y="36" width="6" height="6" fill="#0f172a"/>
        <rect x="68" y="36" width="6" height="6" fill="#0d9488"/>
        <rect x="80" y="36" width="6" height="6" fill="#0f172a"/>

        <rect x="8" y="48" width="6" height="6" fill="#0d9488"/>
        <rect x="24" y="48" width="6" height="6" fill="#0f172a"/>
        <rect x="40" y="48" width="6" height="6" fill="#0f172a"/>
        <rect x="56" y="48" width="8" height="8" fill="#0d9488" rx="1"/>
        <rect x="72" y="48" width="6" height="6" fill="#0f172a"/>
        <rect x="84" y="48" width="6" height="6" fill="#0d9488"/>

        <rect x="36" y="64" width="6" height="6" fill="#0f172a"/>
        <rect x="48" y="64" width="6" height="6" fill="#0d9488"/>
        <rect x="60" y="64" width="6" height="6" fill="#0f172a"/>
        <rect x="76" y="64" width="6" height="6" fill="#0d9488"/>

        <rect x="36" y="78" width="6" height="6" fill="#0d9488"/>
        <rect x="48" y="78" width="10" height="10" fill="#0f172a" rx="2"/>
        <rect x="66" y="78" width="6" height="6" fill="#0d9488"/>
        <rect x="78" y="78" width="6" height="6" fill="#0f172a"/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs font-bold text-teal-700">Scan with Camera</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-center p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-teal-700">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            <span className="text-sm font-bold">Secure Doctor Share Created</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center space-y-2">
          {renderMockQRCode()}
          <p className="text-xs font-semibold text-slate-800">
            Sharing with {shareData.doctorName}
          </p>
          <div className="flex items-center space-x-1 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Time-Bound: Access expires in {shareData.durationHours || 24} hours</span>
          </div>
        </div>

        {/* Share Link Copy Field */}
        <div className="space-y-1.5 text-left">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Temporary Access Link
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center space-x-1 ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Doctor Portal Test Shortcut */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              onClose();
              onOpenDoctorPortal(shareData.token);
            }}
            className="w-full py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4 text-teal-600" />
            <span>Test Doctor View Portal (Simulate Doctor Opening Link)</span>
          </button>
        </div>

      </div>
    </div>
  );
}

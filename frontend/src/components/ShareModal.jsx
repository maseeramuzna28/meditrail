import React, { useState, useEffect } from 'react';
import { 
  X, 
  Share2, 
  Clock, 
  Check, 
  Shield, 
  AlertCircle, 
  QrCode,
  Lock,
  Calendar,
  FileText,
  User,
  Building2,
  CheckCircle2
} from 'lucide-react';

const DURATION_OPTIONS = [
  { label: '1 Hour', hours: 1, desc: 'Immediate clinical consult' },
  { label: '24 Hours', hours: 24, desc: 'Recommended for standard review' },
  { label: '7 Days', hours: 168, desc: 'Follow-up consultation' },
  { label: '30 Days', hours: 720, desc: 'Extended specialist review' }
];

export default function ShareModal({ 
  isOpen, 
  onClose, 
  records = [], 
  preSelectedRecordIds = [], 
  onCreateShare 
}) {
  const [doctorName, setDoctorName] = useState('Dr. Ahmed Khan');
  const [specialty, setSpecialty] = useState('Cardiology & Internal Medicine');
  const [durationHours, setDurationHours] = useState(24);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (preSelectedRecordIds && preSelectedRecordIds.length > 0) {
      setSelectedIds(preSelectedRecordIds);
    } else if (records.length > 0) {
      // Default: select first 2 records as realistic default
      setSelectedIds(records.slice(0, 2).map(r => r.id));
    }
  }, [preSelectedRecordIds, records, isOpen]);

  if (!isOpen) return null;

  const toggleRecord = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === records.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(records.map(r => r.id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;

    onCreateShare({
      doctorName: doctorName.trim() || 'Consulting Physician',
      specialty: specialty.trim() || 'General Medicine',
      durationHours: Number(durationHours),
      selectedRecordIds: selectedIds
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Share Records With Doctor</h3>
              <p className="text-[11px] text-slate-500">Create a secure, temporary authorization</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Doctor Info Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Doctor / Facility Name
              </label>
              <input
                type="text"
                required
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="e.g. Dr. Ahmed Khan"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Specialty / Department
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. Cardiology"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/15"
              />
            </div>
          </div>

          {/* Expiration Duration Selector (Strictly per prompt specification) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Access Expiry Window</span>
              <span className="text-[11px] font-mono text-teal-700 normal-case">Automatic revocation</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DURATION_OPTIONS.map(opt => (
                <button
                  type="button"
                  key={opt.hours}
                  onClick={() => setDurationHours(opt.hours)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    durationHours === opt.hours
                      ? 'bg-teal-50 border-teal-600 text-teal-900 ring-1 ring-teal-500/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs font-bold">{opt.label}</span>
                  <span className="block text-[10px] text-slate-500 truncate">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selective Record Picker Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Select Records to Include ({selectedIds.length} of {records.length})
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                {selectedIds.length === records.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-2.5 bg-slate-50/50">
              {records.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No records available to share.</p>
              ) : (
                records.map(record => {
                  const isChecked = selectedIds.includes(record.id);
                  return (
                    <label
                      key={record.id}
                      className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-white border-teal-500 shadow-xs ring-1 ring-teal-500/10' 
                          : 'bg-white/60 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleRecord(record.id)}
                        className="mt-0.5 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">{record.title}</span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">{record.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-semibold text-teal-700">{record.category}</span>
                          {record.doctor && <span>• {record.doctor}</span>}
                        </div>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Privacy & Scoped Consent Disclaimer */}
          <div className="bg-teal-50/60 border border-teal-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-teal-900">
            <Lock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Strict Patient Control:</strong> The recipient doctor will <strong>ONLY</strong> see the {selectedIds.length} checked records. They will not see your unselected medical history. You can revoke access immediately at any time.
            </p>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedIds.length === 0}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold text-white shadow-sm transition-all flex items-center gap-2 ${
                selectedIds.length > 0 
                  ? 'bg-teal-700 hover:bg-teal-800 focus:ring-2 focus:ring-teal-500/20 cursor-pointer' 
                  : 'bg-teal-800/40 cursor-not-allowed'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Generate Secure Share Link & QR</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

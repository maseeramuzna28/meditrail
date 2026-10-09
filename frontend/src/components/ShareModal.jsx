import React, { useState } from 'react';
import { X, Share2, Clock, Check, Shield, AlertCircle, QrCode } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, records = [], preSelectedRecordId, onCreateShare }) {
  const [doctorName, setDoctorName] = useState('Dr. Ahmed Khan');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [durationHours, setDurationHours] = useState(24);
  const [selectedIds, setSelectedIds] = useState(
    preSelectedRecordId ? [preSelectedRecordId] : records.slice(0, 2).map(r => r.id)
  );

  if (!isOpen) return null;

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
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
      doctorName,
      specialty,
      durationHours: Number(durationHours),
      selectedRecordIds: selectedIds
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Share Records with Doctor</h3>
              <p className="text-xs text-slate-500">Patient-controlled temporary access link</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* Privacy Security Callout */}
          <div className="bg-teal-50 border border-teal-200 p-3.5 rounded-xl flex items-start space-x-3 text-xs text-teal-900">
            <Shield className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Strict Access Control</span>
              <span>The doctor will ONLY receive access to the specific records you select below. Your full medical vault remains private.</span>
            </div>
          </div>

          {/* Doctor Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Doctor Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Ahmed Khan"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specialty / Department
              </label>
              <input
                type="text"
                placeholder="e.g. Cardiology"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Expiry Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Access Expiry Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '1 Hour', hours: 1 },
                { label: '24 Hours', hours: 24 },
                { label: '7 Days', hours: 168 }
              ].map(opt => (
                <button
                  key={opt.hours}
                  type="button"
                  onClick={() => setDurationHours(opt.hours)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    durationHours === opt.hours
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Select Specific Records */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Select Records to Include ({selectedIds.length}/{records.length})
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-teal-600 hover:text-teal-700 font-medium"
              >
                {selectedIds.length === records.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {records.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl text-center">
                No medical records available to share.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {records.map(record => {
                  const isChecked = selectedIds.includes(record.id);
                  return (
                    <div
                      key={record.id}
                      onClick={() => toggleSelect(record.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked 
                          ? 'border-teal-500 bg-teal-50/40 text-slate-900' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Handled by parent container click
                          className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{record.title}</p>
                          <p className="text-[11px] text-slate-500">{record.category} • {record.date}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{record.fileSize || 'PDF'}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {selectedIds.length === 0 && (
            <div className="flex items-center space-x-1.5 text-rose-600 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please select at least one record to generate a share link.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedIds.length === 0}
              className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Generate Link & QR Code</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

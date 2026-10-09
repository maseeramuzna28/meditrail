import React from 'react';
import { X, Download, Share2, Shield, Calendar, User, Building2, FileText, CheckCircle2 } from 'lucide-react';

export default function DocumentViewerModal({ record, isOpen, onClose, onShareRecord }) {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-md">
                {record.category}
              </span>
              <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{record.title}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <p className="text-slate-400 font-medium">Practitioner</p>
                <p className="font-semibold text-slate-800">{record.doctor}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <p className="text-slate-400 font-medium">Facility</p>
                <p className="font-semibold text-slate-800">{record.hospital}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <p className="text-slate-400 font-medium">Issued Date</p>
                <p className="font-semibold text-slate-800">{record.date}</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Clinical Details & Summary</h4>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
              {record.description}
            </div>
          </div>

          {/* Document Preview Simulation Card */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Document Attachment</h4>
            <div className="border border-slate-200 rounded-xl bg-slate-900 text-white p-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-teal-400" />
                  <span className="font-mono text-xs text-slate-300">{record.fileName || 'Medical_Record.pdf'}</span>
                </div>
                <span className="text-xs bg-slate-800 text-teal-400 px-2.5 py-1 rounded-md font-mono">Verified PDF</span>
              </div>

              {/* Simulated Paper Document Content */}
              <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700/80 space-y-3 font-mono text-xs text-slate-300">
                <div className="flex justify-between text-slate-400 text-[11px] border-b border-slate-700 pb-2">
                  <span>DOCUMENT REF: {record.id.toUpperCase()}</span>
                  <span>SECURITY CLASSIFICATION: CONFIDENTIAL</span>
                </div>
                <p className="text-white font-sans text-sm font-semibold">{record.title}</p>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">{record.description}</p>
                <div className="pt-2 flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="flex items-center space-x-1 text-teal-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cryptographically Signed Record</span>
                  </span>
                  <span>{record.fileSize || '1.4 MB'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>Encrypted Patient Vault Record</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose();
                onShareRecord(record);
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Share With Doctor</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

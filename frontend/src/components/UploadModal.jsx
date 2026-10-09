import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Prescriptions');
  const [doctor, setDoctor] = useState('');
  const [hospital, setHospital] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSimulateFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!title) {
        // Auto-fill title from filename
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    setIsUploading(true);
    setTimeout(() => {
      onUploadSuccess({
        title,
        category,
        doctor: doctor || 'Dr. Unspecified',
        hospital: hospital || 'Health Center',
        date,
        description,
        fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
        fileSize: '1.5 MB'
      });
      setIsUploading(false);
      onClose();
      // Reset form
      setTitle('');
      setDoctor('');
      setHospital('');
      setDescription('');
      setFileName('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Upload Medical Record</h3>
              <p className="text-xs text-slate-500">Store a new document securely in your vault</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* File attachment area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Document File (PDF / Image)
            </label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-teal-500 transition-colors bg-slate-50">
              <input
                type="file"
                onChange={handleSimulateFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <div className="flex flex-col items-center justify-center space-y-1">
                <FileText className="w-8 h-8 text-teal-600" />
                {fileName ? (
                  <div className="flex items-center space-x-1.5 text-xs font-medium text-teal-700">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>{fileName}</span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-medium text-slate-700">Click or drag file to attach</p>
                    <p className="text-[11px] text-slate-400">PDF, PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Record Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Annual Blood Test Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
              >
                <option value="Prescriptions">Prescription</option>
                <option value="Lab Reports">Lab Report</option>
                <option value="Diagnoses">Diagnosis</option>
                <option value="Discharge Summaries">Discharge Summary</option>
                <option value="Medical Certificates">Medical Certificate</option>
                <option value="Other Medical Documents">Other Medical Document</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Record Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Doctor & Hospital */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Doctor Name
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Ahmed Khan"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hospital / Clinic / Lab
              </label>
              <input
                type="text"
                placeholder="e.g. City Diagnostics"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinical Notes / Description
            </label>
            <textarea
              rows={3}
              placeholder="Add key summary, dosage instructions, or test notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          {/* Actions */}
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
              disabled={isUploading}
              className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2"
            >
              {isUploading ? (
                <span>Storing Record...</span>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Save to Vault</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

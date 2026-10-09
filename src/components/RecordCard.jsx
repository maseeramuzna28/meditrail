import React from 'react';
import { 
  FileText, 
  Pill, 
  TestTube, 
  Activity, 
  Award, 
  Calendar, 
  Building2, 
  User, 
  Eye, 
  Share2, 
  Trash2 
} from 'lucide-react';

const CATEGORY_STYLES = {
  'Prescriptions': { icon: Pill, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'Lab Reports': { icon: TestTube, bg: 'bg-teal-50 text-teal-700 border-teal-200' },
  'Diagnoses': { icon: Activity, bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  'Discharge Summaries': { icon: FileText, bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  'Medical Certificates': { icon: Award, bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  'Other Medical Documents': { icon: FileText, bg: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export default function RecordCard({ record, onView, onShare, onDelete, isSelected, onSelectToggle }) {
  const categoryConfig = CATEGORY_STYLES[record.category] || CATEGORY_STYLES['Other Medical Documents'];
  const Icon = categoryConfig.icon;

  return (
    <div className={`bg-white border rounded-xl p-5 transition-all duration-200 flex flex-col justify-between ${
      isSelected ? 'border-teal-600 bg-teal-50/20 shadow-sm ring-1 ring-teal-600' : 'border-slate-200 hover:border-slate-300'
    }`}>
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${categoryConfig.bg}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{record.category}</span>
          </span>

          {onSelectToggle && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelectToggle(record.id)}
              className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
            />
          )}
        </div>

        {/* Title */}
        <h3 
          onClick={() => onView(record)} 
          className="text-base font-semibold text-slate-900 hover:text-teal-700 cursor-pointer line-clamp-2 mb-2"
        >
          {record.title}
        </h3>

        {/* Details */}
        <div className="space-y-1.5 text-xs text-slate-500 mb-4">
          <div className="flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{record.doctor}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{record.hospital}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{record.date}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          {record.description}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {record.fileSize || 'PDF'}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onView(record)}
            className="p-1.5 rounded-md text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-colors"
            title="View Record"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {onShare && (
            <button
              onClick={() => onShare(record)}
              className="p-1.5 rounded-md text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-colors"
              title="Share Record"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(record.id)}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

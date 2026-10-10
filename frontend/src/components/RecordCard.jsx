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
  Trash2,
  AlertCircle
} from 'lucide-react';

const CATEGORY_STYLES = {
  'Prescriptions': { 
    icon: Pill, 
    badge: 'text-indigo-700 bg-indigo-50 border-indigo-200' 
  },
  'Lab Reports': { 
    icon: TestTube, 
    badge: 'text-teal-700 bg-teal-50 border-teal-200' 
  },
  'Diagnoses': { 
    icon: Activity, 
    badge: 'text-amber-700 bg-amber-50 border-amber-200' 
  },
  'Discharge Summaries': { 
    icon: FileText, 
    badge: 'text-blue-700 bg-blue-50 border-blue-200' 
  },
  'Medical Certificates': { 
    icon: Award, 
    badge: 'text-slate-700 bg-slate-50 border-slate-200' 
  },
  'Other Medical Documents': { 
    icon: FileText, 
    badge: 'text-slate-700 bg-slate-50 border-slate-200' 
  }
};

export default function RecordCard({ 
  record, 
  onView, 
  onShare, 
  onDelete, 
  isSelected, 
  onToggleSelect,
  selectable = false 
}) {
  const categoryInfo = CATEGORY_STYLES[record.category] || CATEGORY_STYLES['Other Medical Documents'];
  const Icon = categoryInfo.icon;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div 
      className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between ${
        isSelected ? 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/10' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Top Header: Category Badge + Date + Checkbox */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${categoryInfo.badge}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{record.category}</span>
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {formatDate(record.date)}
            </span>

            {selectable && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect && onToggleSelect(record.id)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                aria-label={`Select ${record.title} for sharing`}
              />
            )}
          </div>
        </div>

        {/* Record Title */}
        <h3 className="text-base font-semibold text-slate-900 tracking-tight leading-snug mb-2 line-clamp-1">
          {record.title}
        </h3>

        {/* Doctor & Hospital Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-slate-600">
          {record.doctor && (
            <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              <User className="w-3 h-3 text-slate-400" />
              <span className="font-medium text-slate-700">{record.doctor}</span>
            </span>
          )}
          {record.hospital && (
            <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span className="text-slate-600">{record.hospital}</span>
            </span>
          )}
        </div>

        {/* Clinical Notes / Description */}
        {record.description && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {record.description}
          </p>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onView && onView(record)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50/60 hover:bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200/50 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-teal-600" />
          <span>View Record</span>
        </button>

        <div className="flex items-center gap-1">
          {onShare && (
            <button
              onClick={() => onShare(record)}
              title="Share this record with a doctor"
              className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(record.id)}
              title="Delete record"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

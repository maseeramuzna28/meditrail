import React from 'react';
import { 
  Clock, 
  Pill, 
  TestTube, 
  Activity, 
  FileText, 
  Award, 
  Building2, 
  User, 
  Eye, 
  Share2, 
  Calendar,
  ArrowDown,
  CheckCircle2
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Prescriptions': { 
    icon: Pill, 
    color: 'bg-indigo-600 text-white', 
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' 
  },
  'Lab Reports': { 
    icon: TestTube, 
    color: 'bg-teal-600 text-white', 
    badge: 'bg-teal-50 text-teal-700 border-teal-200' 
  },
  'Diagnoses': { 
    icon: Activity, 
    color: 'bg-amber-600 text-white', 
    badge: 'bg-amber-50 text-amber-700 border-amber-200' 
  },
  'Discharge Summaries': { 
    icon: FileText, 
    color: 'bg-blue-600 text-white', 
    badge: 'bg-blue-50 text-blue-700 border-blue-200' 
  },
  'Medical Certificates': { 
    icon: Award, 
    color: 'bg-slate-700 text-white', 
    badge: 'bg-slate-50 text-slate-700 border-slate-200' 
  },
  'Other Medical Documents': { 
    icon: FileText, 
    color: 'bg-slate-700 text-white', 
    badge: 'bg-slate-50 text-slate-700 border-slate-200' 
  }
};

export default function TimelinePage({ records = [], onViewRecord, onOpenShareModal }) {
  // Sort records chronologically (newest first)
  const sortedRecords = [...records].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const formatTimelineDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Clock className="w-4 h-4 text-teal-600" />
          <span>Chronological Health Journey</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medical Timeline</h1>
        <p className="text-xs text-slate-500">
          A seamless chronological trail connecting all your clinical visits, test reports, and prescriptions
        </p>
      </div>

      {sortedRecords.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <Clock className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Timeline Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload medical records to visualize your complete health timeline in chronological sequence.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-8">
          
          {/* Continuous Vertical Spine */}
          <div className="absolute left-3.5 sm:left-4.5 top-3 bottom-3 w-0.5 bg-slate-200" />

          {sortedRecords.map((record, index) => {
            const catInfo = CATEGORY_ICONS[record.category] || CATEGORY_ICONS['Other Medical Documents'];
            const Icon = catInfo.icon;

            return (
              <div key={record.id} className="relative group">
                
                {/* Node Dot on Timeline */}
                <div className={`absolute -left-6 sm:-left-8 top-1.5 w-7 h-7 rounded-full ${catInfo.color} flex items-center justify-center ring-4 ring-white shadow-xs z-10 transition-transform group-hover:scale-110`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Timeline Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all ml-4 sm:ml-6 space-y-3">
                  
                  {/* Top Bar: Date + Category Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {formatTimelineDate(record.date)}
                    </span>

                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${catInfo.badge}`}>
                      {record.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {record.title}
                  </h3>

                  {/* Facility & Doctor Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    {record.doctor && (
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{record.doctor}</span>
                      </span>
                    )}
                    {record.hospital && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{record.hospital}</span>
                      </span>
                    )}
                  </div>

                  {/* Clinical Description / Summary */}
                  {record.description && (
                    <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 text-xs text-slate-600 leading-relaxed">
                      {record.description}
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onViewRecord && onViewRecord(record)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Full Document</span>
                    </button>

                    <button
                      onClick={() => onOpenShareModal && onOpenShareModal([record.id])}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-sky-600 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Record</span>
                    </button>
                  </div>

                </div>

                {/* Sub-node connector arrow */}
                {index < sortedRecords.length - 1 && (
                  <div className="text-slate-300 ml-4 pl-1 pt-1">
                    <ArrowDown className="w-3.5 h-3.5 opacity-60" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

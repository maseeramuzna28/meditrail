import React from 'react';
import { 
  Clock, 
  Pill, 
  TestTube, 
  Activity, 
  FileText, 
  Award, 
  Calendar, 
  Building2, 
  User, 
  Eye, 
  Share2 
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Prescriptions': { icon: Pill, color: 'bg-emerald-500 text-white' },
  'Lab Reports': { icon: TestTube, color: 'bg-teal-600 text-white' },
  'Diagnoses': { icon: Activity, color: 'bg-amber-500 text-white' },
  'Discharge Summaries': { icon: FileText, color: 'bg-blue-600 text-white' },
  'Medical Certificates': { icon: Award, color: 'bg-indigo-600 text-white' },
  'Other Medical Documents': { icon: FileText, color: 'bg-slate-600 text-white' }
};

export default function TimelinePage({ records = [], onViewRecord, onShareRecord }) {
  // Sort records chronologically descending
  const sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-teal-700 mb-1">
          <Clock className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Chronological Health Log</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Medical History Timeline</h1>
        <p className="text-xs text-slate-500">
          A clear, continuous timeline of your diagnostic tests, prescriptions, and clinical visits
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8 py-2">
        {sortedRecords.map((record, index) => {
          const catConfig = CATEGORY_ICONS[record.category] || CATEGORY_ICONS['Other Medical Documents'];
          const Icon = catConfig.icon;

          return (
            <div key={record.id} className="relative group">
              
              {/* Timeline Node Icon Badge */}
              <div className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-xl ${catConfig.color} flex items-center justify-center shadow-sm ring-4 ring-slate-50`}>
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>

              {/* Card Container */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:border-teal-500">
                
                {/* Date & Category Badge */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-slate-500 font-semibold font-mono">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>{record.date}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
                    {record.category}
                  </span>
                </div>

                {/* Record Title */}
                <h3 
                  onClick={() => onViewRecord(record)}
                  className="text-base font-bold text-slate-900 hover:text-teal-700 cursor-pointer"
                >
                  {record.title}
                </h3>

                {/* Doctor & Facility */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-700">{record.doctor}</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{record.hospital}</span>
                  </span>
                </div>

                {/* Clinical Summary Note */}
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {record.description}
                </p>

                {/* Timeline Card Footer Actions */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">{record.fileName || 'PDF Document'}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewRecord(record)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Record</span>
                    </button>
                    <button
                      onClick={() => onShareRecord(record)}
                      className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold rounded-lg border border-teal-200 transition-colors flex items-center space-x-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Record</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

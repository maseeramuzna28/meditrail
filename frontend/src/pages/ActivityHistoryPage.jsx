import React from 'react';
import { Activity, ShieldCheck, Lock, Share2, Upload, Trash2, Ban } from 'lucide-react';

const EVENT_ICONS = {
  'ACCESS': { icon: Lock, bg: 'bg-amber-100 text-amber-800' },
  'SHARE_CREATE': { icon: Share2, bg: 'bg-teal-100 text-teal-800' },
  'REVOKE': { icon: Ban, bg: 'bg-rose-100 text-rose-800' },
  'UPLOAD': { icon: Upload, bg: 'bg-emerald-100 text-emerald-800' },
  'DELETE': { icon: Trash2, bg: 'bg-slate-200 text-slate-700' }
};

export default function ActivityHistoryPage({ logs = [] }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center space-x-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Activity className="w-4 h-4 text-teal-600" />
          <span>Security Audit Trail</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Access Activity Log</h1>
        <p className="text-xs text-slate-500">
          Complete, tamper-evident history of document uploads, doctor share creations, record views, and access revocations
        </p>
      </div>

      {/* Audit Log List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        {logs.map((log) => {
          const config = EVENT_ICONS[log.type] || EVENT_ICONS['ACCESS'];
          const Icon = config.icon;

          return (
            <div 
              key={log.id} 
              className="flex items-start space-x-4 p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0 mt-0.5 font-bold`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{log.title}</h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{log.details}</p>
                <div className="pt-1 flex items-center space-x-2 text-[10px]">
                  <span className="font-semibold text-slate-500">Initiated By:</span>
                  <span className="font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {log.actor}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

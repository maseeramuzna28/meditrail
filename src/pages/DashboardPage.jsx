import React from 'react';
import { 
  FileText, 
  Clock, 
  Sparkles, 
  Share2, 
  Upload, 
  ShieldCheck, 
  Lock, 
  Activity, 
  ArrowRight,
  Plus
} from 'lucide-react';
import RecordCard from '../components/RecordCard';

export default function DashboardPage({ 
  records = [], 
  shares = [], 
  logs = [], 
  user, 
  setActivePage, 
  onOpenUpload, 
  onOpenShare, 
  onViewRecord, 
  onDeleteRecord 
}) {
  const activeShares = shares.filter(s => s.status === 'active');
  const recentRecords = records.slice(0, 3);
  const recentLogs = logs.slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-md text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Vault Protected & Encrypted</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Alex Mercer'}
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            MediTrail is actively keeping your medical history organized, secure, and entirely under your control.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenUpload}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Record</span>
          </button>
          <button
            onClick={onOpenShare}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share With Doctor</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Records</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{records.length}</p>
          <p className="text-xs text-slate-500">Stored in encrypted vault</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Shares</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{activeShares.length}</p>
          <p className="text-xs text-amber-700 font-medium">Time-bound doctor links live</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Summary</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">Updated</p>
          <p className="text-xs text-slate-500">6 Clinical sections extracted</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Audit Events</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{logs.length}</p>
          <p className="text-xs text-slate-500">Access security log entries</p>
        </div>

      </div>

      {/* Quick Action Navigation Cards */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Navigation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button
            onClick={onOpenUpload}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 transition-all hover:border-teal-500 group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Upload Record</h3>
            <p className="text-xs text-slate-500">Add prescription, lab test or diagnosis</p>
          </button>

          <button
            onClick={() => setActivePage('timeline')}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 transition-all hover:border-teal-500 group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">View Timeline</h3>
            <p className="text-xs text-slate-500">Visual chronological medical history</p>
          </button>

          <button
            onClick={() => setActivePage('ai-summary')}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 transition-all hover:border-teal-500 group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">AI Health Summary</h3>
            <p className="text-xs text-slate-500">Consolidated overview of conditions & Rx</p>
          </button>

          <button
            onClick={onOpenShare}
            className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 transition-all hover:border-teal-500 group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Share With Doctor</h3>
            <p className="text-xs text-slate-500">Create time-bound access link or QR code</p>
          </button>

        </div>
      </div>

      {/* Main Split Section: Recent Records + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Records Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Medical Records</h3>
            <button
              onClick={() => setActivePage('vault')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
            >
              <span>View All Vault ({records.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentRecords.map(record => (
              <RecordCard
                key={record.id}
                record={record}
                onView={onViewRecord}
                onShare={() => onOpenShare(record.id)}
                onDelete={onDeleteRecord}
              />
            ))}
          </div>
        </div>

        {/* Security Audit Feed Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Activity Log</h3>
            <button
              onClick={() => setActivePage('activity')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Full Log
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
            {recentLogs.map(log => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{log.title}</span>
                  <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{log.details}</p>
                <span className="inline-block text-[10px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                  {log.actor}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

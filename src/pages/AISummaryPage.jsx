import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  Activity, 
  Pill, 
  TestTube, 
  ShieldAlert, 
  FileText, 
  HelpCircle,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export default function AISummaryPage({ aiSummaryData, onRegenerate }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const data = aiSummaryData || {};

  const handleRegenerateClick = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onRegenerate();
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI Health Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">AI Medical Record Summary</h1>
          <p className="text-xs text-slate-500">
            Consolidated summary extracted strictly from your uploaded medical documents
          </p>
        </div>

        <button
          onClick={handleRegenerateClick}
          disabled={isGenerating}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Analyzing Vault Records...' : 'Regenerate AI Summary'}</span>
        </button>
      </div>

      {/* MANDATORY AI MEDICAL DISCLAIMER BANNER */}
      <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-start space-x-3 text-xs text-amber-900 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-sm block">Important Medical Disclaimer</span>
          <p className="text-amber-800 leading-relaxed">
            AI-generated information is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified physician regarding any medical condition or treatment plan.
          </p>
        </div>
      </div>

      {/* Grid of AI Extracted Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Conditions Found */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-teal-700">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4 text-teal-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Diagnosed Conditions</h3>
          </div>
          <div className="space-y-2.5">
            {data.conditions?.map((item, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <p className="font-bold text-slate-900">{item.title}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Active Medications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-emerald-700">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center font-bold">
              <Pill className="w-4 h-4 text-emerald-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Active Medications</h3>
          </div>
          <div className="space-y-2.5">
            {data.medications?.map((item, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{item.name}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-semibold">{item.dosage}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{item.frequency}</p>
                <p className="text-slate-400 text-[10px]">Indication: {item.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Recent Test Results */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-blue-700">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center font-bold">
              <TestTube className="w-4 h-4 text-blue-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Recent Test Results</h3>
          </div>
          <div className="space-y-2.5">
            {data.testResults?.map((item, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{item.test}</p>
                  <p className="text-slate-400 text-[10px]">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-slate-800">{item.value}</p>
                  <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-semibold">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Allergies */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-rose-700">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Known Allergies</h3>
          </div>
          <div className="space-y-2.5">
            {data.allergies?.map((item, i) => (
              <div key={i} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900">{item.allergen}</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-semibold">{item.severity}</span>
                </div>
                <p className="text-rose-700 text-[11px]">{item.reaction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Important Medical History */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-indigo-700">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4 text-indigo-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Medical History</h3>
          </div>
          <div className="space-y-2.5">
            {data.importantHistory?.map((item, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">{item.year}</span>
                <p className="text-slate-700 text-xs mt-1">{item.event}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Missing Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-amber-700">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4 text-amber-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Missing Information</h3>
          </div>
          <div className="space-y-2">
            {data.missingInfo?.map((item, i) => (
              <div key={i} className="p-3 bg-amber-50/40 rounded-xl border border-amber-100 text-xs text-amber-900 flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

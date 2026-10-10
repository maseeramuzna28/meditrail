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
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function AISummaryPage({ aiSummaryData, onRegenerate }) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Fallback rich structured clinical summary if not supplied
  const summary = aiSummaryData || {
    lastUpdated: 'Today at 7:30 PM',
    conditions: [
      { name: 'Essential Hypertension (Stage 1)', source: 'Dr. Ahmed Khan (Prescription Sep 2026)', status: 'Managed' },
      { name: 'Mild Vitamin D Deficiency', source: 'Apex Health Diagnostics (Lab Oct 2026)', status: 'Supplementation Active' },
      { name: 'Acute Gastroenteritis (Resolved)', source: 'XYZ Hospital Discharge Summary (Aug 2026)', status: 'Resolved' }
    ],
    medications: [
      { name: 'Amlodipine', dosage: '5 mg', frequency: 'Once daily (morning)', purpose: 'Blood pressure control' },
      { name: 'Cholecalciferol (Vitamin D3)', dosage: '60,000 IU', frequency: 'Weekly for 8 weeks', purpose: 'Vitamin D replenishment' }
    ],
    testResults: [
      { test: 'Fasting Blood Glucose', value: '92 mg/dL', status: 'Normal', range: '70 - 99 mg/dL' },
      { test: 'HbA1c', value: '5.6%', status: 'Normal', range: '< 5.7%' },
      { test: 'Serum Vitamin D (25-OH)', value: '22 ng/mL', status: 'Low', range: '30 - 100 ng/mL' },
      { test: 'Total Cholesterol', value: '188 mg/dL', status: 'Desirable', range: '< 200 mg/dL' },
      { test: 'Blood Pressure', value: '128 / 82 mmHg', status: 'Prehypertension', range: '< 120/80 mmHg' }
    ],
    allergies: [
      { allergen: 'Penicillin / Amoxicillin', reaction: 'Mild cutaneous rash & urticaria', severity: 'Moderate' },
      { allergen: 'Sulfa Antibiotics', reaction: 'Reported intolerance during childhood', severity: 'Mild' }
    ],
    history: [
      { event: 'Emergency Room Visit — Dehydration & Gastroenteritis', date: '10 Aug 2026', facility: 'XYZ Hospital' },
      { event: 'Comprehensive Annual Lipid & Metabolic Screening', date: '08 Oct 2026', facility: 'Apex Diagnostics' },
      { event: 'Primary Care Consultation for Blood Pressure Check', date: '25 Sep 2026', facility: 'City Medical Center' }
    ],
    missingInfo: [
      'No recent Renal Function Test (Creatinine/eGFR) on record in past 12 months',
      'Pending follow-up Vitamin D test after 8-week Cholecalciferol course',
      'No formal vaccination booster record uploaded for Influenza (current season)'
    ]
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (onRegenerate) onRegenerate();
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI Clinical Record Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Health Summary</h1>
          <p className="text-xs text-slate-500">
            Automated clinical synthesis compiled strictly from your existing uploaded records
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Analyzing Records...' : 'Regenerate Summary'}</span>
        </button>
      </div>

      {/* MANDATORY MEDICAL DISCLAIMER BANNER (Strictly per hackathon specifications) */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 text-amber-900 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Important Medical Notice
          </h4>
          <p className="text-xs text-amber-800/90 leading-relaxed font-medium">
            "AI-generated information is for informational purposes only and does not replace professional medical advice."
          </p>
          <p className="text-[11px] text-amber-700">
            This summary synthesizes only documented observations found in your uploaded records. It does not diagnose medical conditions, predict outcomes, or prescribe medications.
          </p>
        </div>
      </div>

      {/* Main Clinical Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. 🩺 Conditions Found */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">🩺 Conditions Found</h3>
              <p className="text-[11px] text-slate-500">Documented in uploaded medical records</p>
            </div>
          </div>

          <div className="space-y-3">
            {summary.conditions.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{item.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-teal-100 text-teal-800 rounded">
                    {item.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{item.source}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 💊 Current Medications */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">💊 Medications</h3>
              <p className="text-[11px] text-slate-500">Active medicines found in prescriptions</p>
            </div>
          </div>

          <div className="space-y-3">
            {summary.medications.map((med, idx) => (
              <div key={idx} className="p-3 bg-indigo-50/40 rounded-lg border border-indigo-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950">{med.name}</span>
                  <span className="text-[11px] font-mono font-semibold text-indigo-700">{med.dosage}</span>
                </div>
                <p className="text-[11px] text-slate-600">Schedule: <strong className="text-slate-800">{med.frequency}</strong></p>
                <p className="text-[10px] text-indigo-600/80 italic">{med.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 🧪 Recent Test Results */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <TestTube className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">🧪 Recent Test Results</h3>
              <p className="text-[11px] text-slate-500">Key metrics from diagnostic panels</p>
            </div>
          </div>

          <div className="space-y-2">
            {summary.testResults.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                <div>
                  <span className="font-semibold text-slate-800">{t.test}</span>
                  <span className="block text-[10px] text-slate-400">Ref: {t.range}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900">{t.value}</span>
                  <span className={`block text-[10px] font-semibold ${
                    t.status === 'Normal' || t.status === 'Desirable' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. ⚠️ Allergies */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">⚠️ Allergies</h3>
              <p className="text-[11px] text-slate-500">Documented drug & food sensitivities</p>
            </div>
          </div>

          <div className="space-y-3">
            {summary.allergies.map((allergy, idx) => (
              <div key={idx} className="p-3 bg-rose-50/50 rounded-lg border border-rose-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900">{allergy.allergen}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-rose-100 text-rose-800 rounded">
                    Severity: {allergy.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{allergy.reaction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. 📋 Important Medical History */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">📋 Important Medical History</h3>
              <p className="text-[11px] text-slate-500">Significant historical clinical milestones</p>
            </div>
          </div>

          <div className="space-y-3">
            {summary.history.map((hist, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>{hist.event}</span>
                  <span className="font-mono text-[11px] text-slate-500">{hist.date}</span>
                </div>
                <p className="text-[11px] text-slate-500">{hist.facility}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. ❗ Missing Information */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">❗ Missing Information</h3>
              <p className="text-[11px] text-slate-500">Gaps or recommended follow-ups detected</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {summary.missingInfo.map((msg, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-amber-50/40 p-2.5 rounded-lg border border-amber-100">
                <span className="text-amber-600 font-bold">•</span>
                <span>{msg}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}

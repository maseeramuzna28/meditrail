import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Share2, 
  CheckSquare, 
  Square, 
  Filter, 
  Trash2, 
  Upload,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import RecordCard from '../components/RecordCard';

const CATEGORIES = [
  'All',
  'Prescriptions',
  'Lab Reports',
  'Diagnoses',
  'Discharge Summaries',
  'Medical Certificates',
  'Other Medical Documents'
];

export default function VaultPage({ 
  records = [], 
  onOpenUpload, 
  onViewRecord, 
  onOpenShareModal, 
  onDeleteRecord 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);

  // Filter records by category and search
  const filteredRecords = records.filter(record => {
    const matchesCategory = selectedCategory === 'All' || record.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (record.title || '').toLowerCase().includes(q) ||
      (record.doctor || '').toLowerCase().includes(q) ||
      (record.hospital || '').toLowerCase().includes(q) ||
      (record.description || '').toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const toggleSelectRecord = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map(r => r.id));
    }
  };

  const handleShareSelected = () => {
    if (selectedIds.length === 0) return;
    onOpenShareModal(selectedIds);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Vault Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Digital Medical Vault</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personal Medical Records</h1>
          <p className="text-xs text-slate-500">
            Store, view, search, and manage all your healthcare documents in one secure place
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSelectionMode(!selectionMode);
              if (selectionMode) setSelectedIds([]);
            }}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              selectionMode 
                ? 'bg-teal-50 border-teal-300 text-teal-800' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{selectionMode ? 'Done Selecting' : 'Select for Doctor Share'}</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Record</span>
          </button>
        </div>
      </div>

      {/* Floating Batch Selection Bar when in Selection Mode */}
      {selectionMode && (
        <div className="bg-teal-900 text-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="text-xs font-semibold bg-teal-800 hover:bg-teal-700 px-3 py-1.5 rounded-lg border border-teal-600 transition-colors"
            >
              {selectedIds.length === filteredRecords.length ? 'Deselect All' : 'Select All Filtered'}
            </button>
            <span className="text-xs font-medium text-teal-100">
              <strong className="text-white">{selectedIds.length}</strong> of {filteredRecords.length} records selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareSelected}
              disabled={selectedIds.length === 0}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                selectedIds.length > 0 
                  ? 'bg-white text-teal-900 hover:bg-teal-50 shadow-sm cursor-pointer' 
                  : 'bg-teal-800/60 text-teal-400 cursor-not-allowed'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Generate Doctor Share ({selectedIds.length})</span>
            </button>
            <button
              onClick={() => {
                setSelectionMode(false);
                setSelectedIds([]);
              }}
              className="p-1.5 text-teal-300 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search and Category Filters */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, doctor name, hospital, or prescription note..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/15 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  isSelected 
                    ? 'bg-teal-700 text-white shadow-xs' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Record Grid */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Medical Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'All' 
              ? 'Try clearing your search query or selecting a different category filter.'
              : 'You have not uploaded any records yet. Click below to add your first prescription or lab test.'
            }
          </p>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            Upload Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map(record => (
            <RecordCard
              key={record.id}
              record={record}
              onView={onViewRecord}
              onShare={() => onOpenShareModal([record.id])}
              onDelete={onDeleteRecord}
              selectable={selectionMode}
              isSelected={selectedIds.includes(record.id)}
              onToggleSelect={toggleSelectRecord}
            />
          ))}
        </div>
      )}

    </div>
  );
}

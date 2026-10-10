import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Share2, 
  CheckSquare, 
  Square
} from 'lucide-react';
import RecordCard from '../components/RecordCard';

const CATEGORY_TABS = [
  'All Records',
  'Prescriptions',
  'Lab Reports',
  'Diagnoses',
  'Discharge Summaries',
  'Medical Certificates'
];

export default function VaultPage({ 
  records = [], 
  onViewRecord, 
  onDeleteRecord, 
  onOpenUpload, 
  onOpenShareBatch 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Records');
  const [selectedIds, setSelectedIds] = useState([]);

  // Robust null-safe filter
  const filteredRecords = (records || []).filter(record => {
    if (!record) return false;
    const matchesCategory = activeCategory === 'All Records' || record.category === activeCategory;
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch = !q ||
      (record.title || '').toLowerCase().includes(q) ||
      (record.doctor || '').toLowerCase().includes(q) ||
      (record.hospital || '').toLowerCase().includes(q) ||
      (record.description || '').toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const toggleSelectRecord = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map(r => r.id));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Vault Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medical Record Vault</h1>
          <p className="text-xs text-slate-500">Store, view, search, and manage your health documents</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={() => onOpenShareBatch(selectedIds)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={onOpenUpload}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Document</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 max-w-full">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors border ${
                activeCategory === tab
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search title, doctor, hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
          />
        </div>

      </div>

      {/* Selection Control Bar */}
      {filteredRecords.length > 0 && (
        <div className="flex items-center justify-between bg-slate-100/70 px-4 py-2 rounded-xl text-xs text-slate-600 border border-slate-200/80">
          <span>Showing {filteredRecords.length} document records</span>
          <button
            onClick={handleSelectAll}
            className="font-semibold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
          >
            {selectedIds.length === filteredRecords.length ? (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                <span>Deselect All</span>
              </>
            ) : (
              <>
                <Square className="w-3.5 h-3.5" />
                <span>Select All for Doctor Share</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Grid of Record Cards */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Medical Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No documents matched your search or category filter. Try clearing filters or upload a new record.
            </p>
          </div>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            Upload Medical Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map(record => (
            <RecordCard
              key={record.id}
              record={record}
              onView={onViewRecord}
              onShare={() => onOpenShareBatch([record.id])}
              onDelete={onDeleteRecord}
              isSelected={selectedIds.includes(record.id)}
              onSelectToggle={toggleSelectRecord}
            />
          ))}
        </div>
      )}

    </div>
  );
}

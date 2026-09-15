import React, { useState } from 'react';
import { PreflightCandidateRecord, PreflightExclusionCategory } from './types';
import { X, Search, ShieldAlert, AlertTriangle, Filter, CheckCircle2, Phone, Ban } from 'lucide-react';

interface PreflightExclusionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  exclusions: PreflightCandidateRecord[];
  initialCategory?: PreflightExclusionCategory | 'all';
}

export const PreflightExclusionDrawer: React.FC<PreflightExclusionDrawerProps> = ({
  isOpen,
  onClose,
  exclusions,
  initialCategory = 'all'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PreflightExclusionCategory | 'all'>(initialCategory);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = exclusions.filter((rec) => {
    if (selectedCategory !== 'all' && rec.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return rec.contactName.toLowerCase().includes(q) || rec.destination.includes(q) || rec.reason.toLowerCase().includes(q);
    }
    return true;
  });

  const getCategoryBadge = (cat: PreflightExclusionCategory) => {
    switch (cat) {
      case 'missing_consent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200">Missing Consent</span>;
      case 'suppressed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-200 text-slate-700 border border-slate-300">Suppressed</span>;
      case 'duplicates':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-[#5A4AD2] border border-purple-200">Duplicate</span>;
      case 'invalid_destination':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-red-700 border border-red-200">Invalid Destination</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700">
                Canonical Preflight Inspection
              </span>
              <h2 className="text-base font-extrabold text-slate-900">
                Candidate Exclusion Breakdown
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 text-xs font-semibold">
            {[
              { id: 'all', label: 'All Excluded' },
              { id: 'missing_consent', label: 'Missing Consent' },
              { id: 'suppressed', label: 'Suppressed' },
              { id: 'duplicates', label: 'Duplicates' },
              { id: 'invalid_destination', label: 'Invalid Destination' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                  selectedCategory === tab.id
                    ? 'bg-[#5A4AD2] text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name, destination, or reason..."
              className="w-full text-xs pl-8.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white"
            />
          </div>

          {/* Scrollable Records */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                No candidate exclusion records matching this criteria.
              </div>
            ) : (
              filtered.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rec.contactName}</span>
                    {getCategoryBadge(rec.category)}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono font-medium">{rec.destination}</span>
                    <span>Source: {rec.sourceContext}</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/60 text-[11px] text-slate-700 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{rec.reason}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
          <span>Showing {filtered.length} excluded candidates</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

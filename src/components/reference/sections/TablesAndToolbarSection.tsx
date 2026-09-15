import React, { useState } from 'react';
import { 
  Table as TableIcon, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Eye, 
  Send, 
  CheckCheck, 
  AlertCircle, 
  ShieldAlert, 
  User, 
  Clock, 
  Phone,
  AlertTriangle,
  RefreshCw,
  Lock
} from 'lucide-react';

interface TablesAndToolbarSectionProps {
  isDark?: boolean;
}

export const TablesAndToolbarSection: React.FC<TablesAndToolbarSectionProps> = ({ isDark = false }) => {
  // Table state simulator
  const [tableState, setTableState] = useState<'normal' | 'loading' | 'empty' | 'no_results' | 'error' | 'view_only'>('normal');
  const [selectedRowId, setSelectedRowId] = useState<string>('rec-2');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showMobileFilterSheet, setShowMobileFilterSheet] = useState(false);

  const sampleRows = [
    {
      id: 'rec-1',
      contact: 'Priya Swaminathan',
      contactId: 'cnt-001',
      phone: '+91 98401 11223',
      campaign: 'September Follow-up',
      inbox: 'Agamagizh Main',
      status: 'delivered',
      time: '14 Sep, 10:48 AM',
      outcome: 'Confirmed handset receipt'
    },
    {
      id: 'rec-2',
      contact: 'Dr. Ragu Ramachandran',
      contactId: 'cnt-002',
      phone: '+91 98402 33445',
      campaign: 'Appointment Reminder',
      inbox: 'Adyar Reception',
      status: 'read',
      time: '14 Sep, 10:45 AM',
      outcome: 'Blue tick read verified'
    },
    {
      id: 'rec-3',
      contact: 'Vikram Chandran',
      contactId: 'cnt-003',
      phone: '+91 94441 55667',
      campaign: 'September Follow-up',
      inbox: 'Agamagizh Main',
      status: 'failed',
      time: '14 Sep, 10:42 AM',
      outcome: 'Delivery failed: Handset routing'
    },
    {
      id: 'rec-4',
      contact: 'Ananya Sridhar',
      contactId: 'cnt-004',
      phone: '+91 98840 77889',
      campaign: 'Feedback Request',
      inbox: 'Anna Nagar Support',
      status: 'excluded',
      time: '14 Sep, 10:40 AM',
      outcome: 'Preflight safety: Missing consent'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isDark ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            <CheckCheck className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'read':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isDark ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-indigo-100 text-indigo-800'
          }`}>
            <Eye className="w-3 h-3" />
            Read
          </span>
        );
      case 'failed':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isDark ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-rose-100 text-rose-800'
          }`}>
            <AlertCircle className="w-3 h-3" />
            Failed
          </span>
        );
      case 'excluded':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isDark ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-800'
          }`}>
            <ShieldAlert className="w-3 h-3" />
            Excluded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="tables" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-[#5A4AD2]" />
            <span>Dense Operational Tables & Responsive Ledger</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Standard high-density data grid for desktop with intentional transformation into structured cards on mobile (≤640px).
          </p>
        </div>

        {/* State Simulator Bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Preview State:</span>
          {(['normal', 'loading', 'empty', 'no_results', 'error', 'view_only'] as const).map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setTableState(st)}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors ${
                tableState === st
                  ? 'bg-[#5A4AD2] text-white'
                  : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Canonical Search + Filter Toolbar */}
      <div className={`p-3.5 rounded-2xl border transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Desktop Filter Row */}
        <div className="hidden sm:flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search contact, phone, campaign…"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className={`w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="all">All Outcomes</option>
              <option value="delivered">Delivered</option>
              <option value="read">Read</option>
              <option value="failed">Failed</option>
              <option value="excluded">Excluded</option>
            </select>

            {/* Secondary Filter */}
            <select
              defaultValue="all"
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="all">All Inboxes</option>
              <option value="main">Agamagizh Main</option>
              <option value="adyar">Adyar Reception</option>
            </select>

            {/* Clear Filters */}
            {(searchFilter || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchFilter('');
                  setStatusFilter('all');
                }}
                className="text-xs font-semibold text-[#5A4AD2] dark:text-violet-400 hover:underline px-2"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <strong>4</strong> of 1,248 records
          </div>
        </div>

        {/* Mobile Filter Row */}
        <div className="sm:hidden space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search…"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className={`w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowMobileFilterSheet(!showMobileFilterSheet)}
              className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Table Canvas / States */}
      <div className={`rounded-2xl border overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Table View Header Notice if View-Only */}
        {tableState === 'view_only' && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span><strong>View-Only Permission:</strong> You have read access to recipient audit logs, but cannot trigger resends or modify audience data.</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/60">
              AUDIT_READ_ONLY
            </span>
          </div>
        )}

        {/* State A: Loading Skeleton */}
        {tableState === 'loading' && (
          <div className="p-5 space-y-3 animate-pulse">
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="space-y-2 pt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {/* State B: True Empty State */}
        {tableState === 'empty' && (
          <div className="p-10 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2">
              <TableIcon className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No records yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Recipients will appear here once your broadcast campaign begins dispatch.
            </p>
          </div>
        )}

        {/* State C: No Search Results */}
        {tableState === 'no_results' && (
          <div className="p-10 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No contacts match "{searchFilter || 'Meera'}"
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Check your search spelling or clear filters to view all campaign recipients.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchFilter('');
                setTableState('normal');
              }}
              className="mt-2 text-xs font-bold text-[#5A4AD2] dark:text-violet-400 hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* State D: Table Load Error */}
        {tableState === 'error' && (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Failed to load recipient ledger
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              The query timed out. Filter controls remain usable while reconnecting.
            </p>
            <button
              type="button"
              onClick={() => setTableState('normal')}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#5A4AD2] text-white hover:bg-[#4838B8]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* State E: Normal & View-Only Table Data */}
        {(tableState === 'normal' || tableState === 'view_only') && (
          <>
            {/* Desktop Dense Table (>640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    <th className="py-2.5 px-4">Contact</th>
                    <th className="py-2.5 px-4">Destination</th>
                    <th className="py-2.5 px-4">Campaign</th>
                    <th className="py-2.5 px-4">Inbox</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4">Outcome Reason</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                  {sampleRows.map(row => {
                    const isSelected = selectedRowId === row.id;
                    return (
                      <tr 
                        key={row.id}
                        onClick={() => setSelectedRowId(row.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected 
                            ? isDark ? 'bg-violet-950/30' : 'bg-violet-50/70' 
                            : isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{row.contact}</div>
                          <div className="text-[10px] font-mono text-slate-400">{row.contactId}</div>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                          {row.phone}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                          {row.campaign}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">
                          {row.inbox}
                        </td>
                        <td className="py-2.5 px-4">
                          {getStatusBadge(row.status)}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">
                          {row.time}
                        </td>
                        <td className="py-2.5 px-4 text-[11px] text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                          {row.outcome}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            type="button"
                            className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                              isDark ? 'text-violet-400 hover:bg-violet-950/60' : 'text-[#5A4AD2] hover:bg-violet-100'
                            }`}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Cards Transformation (≤640px) */}
            <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800 p-3 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                Mobile Row Transformation (~390×844)
              </span>
              {sampleRows.map(row => (
                <div key={row.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                        {row.contact}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {row.phone}
                      </span>
                    </div>
                    {getStatusBadge(row.status)}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{row.campaign}</span>
                    <span>{row.time}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 italic">
                    {row.outcome}
                  </div>
                  <button
                    type="button"
                    className="w-full py-1.5 rounded-lg border text-xs font-bold text-[#5A4AD2] dark:text-violet-300 border-violet-200 dark:border-violet-900 hover:bg-violet-50 dark:hover:bg-slate-800 text-center"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* Compact Pagination Bar */}
            <div className={`p-3 border-t flex items-center justify-between text-xs text-slate-500 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/50'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-[11px]">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={e => setPageSize(Number(e.target.value))}
                  className={`text-[11px] px-2 py-1 rounded border ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium">Page {currentPage} of 125</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-1 rounded border disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-1 rounded border"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { HelpCircle, BookOpen, Search, Plus, ExternalLink, FileText, CheckCircle2, Eye } from 'lucide-react';

export const HelpCenterView: React.FC = () => {
  const [search, setSearch] = useState('');

  const articles = [
    { id: '1', title: 'How to reschedule your appointment via WhatsApp', category: 'Appointments', views: 1420, status: 'Published' },
    { id: '2', title: 'Understanding Consultation Fees and GST Invoices', category: 'Billing', views: 980, status: 'Published' },
    { id: '3', title: 'Adyar & Anna Nagar Campus directions and parking', category: 'Locations', views: 2450, status: 'Published' },
    { id: '4', title: 'Preparing your child for their first intake session', category: 'Caregiver Guide', views: 1890, status: 'Published' },
    { id: '5', title: 'Tele-consultation connectivity checklist', category: 'Digital Care', views: 640, status: 'Draft' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Help Center & Knowledge Base</h1>
          <p className="text-xs text-[#6E737F]">
            Public knowledge portal articles, self-service FAQs, and caregiver guidance documents.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-2xl border border-[#E3E5E9] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help articles by topic, keyword, or category..."
            className="w-full text-xs pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white text-slate-800"
          />
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-[#E3E5E9] shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F9FA] text-[#6E737F] font-bold border-b border-[#E3E5E9] uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Article Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Total Reads</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles.map((art) => (
              <tr key={art.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#5A4AD2]" />
                  <span>{art.title}</span>
                </td>
                <td className="py-3 px-4 text-slate-600 font-semibold">{art.category}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    art.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {art.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-500 font-mono">{art.views.toLocaleString()}</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-xs font-bold text-[#5A4AD2] hover:underline">
                    Edit Article
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

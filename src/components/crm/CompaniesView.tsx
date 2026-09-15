import React, { useState } from 'react';
import { Company } from '../../types';
import { Building2, Search, Plus, ExternalLink, Users, MessageSquare, Phone, MapPin } from 'lucide-react';
import { INITIAL_COMPANIES } from '../../data/mockData';

export const CompaniesView: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [search, setSearch] = useState('');

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.industry.toLowerCase().includes(search.toLowerCase()) ||
    c.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Companies & Organizations</h1>
          <p className="text-xs text-[#6E737F]">
            Corporate wellness partners, healthcare referral clinics, and institutional accounts.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#E3E5E9] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies by name, domain, industry..."
            className="w-full text-xs pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white text-slate-800"
          />
        </div>
      </div>

      {/* Grid of Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((comp) => (
          <div
            key={comp.id}
            className="bg-white p-5 rounded-2xl border border-[#E3E5E9] shadow-2xs hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEECFB] text-[#5A4AD2] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{comp.name}</h3>
                  <span className="text-[11px] text-[#5A4AD2] font-semibold">{comp.domain}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                {comp.industry}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{comp.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{comp.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Users className="w-3.5 h-3.5 text-[#5A4AD2]" />
                <span>{comp.contactsCount} Contacts</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{comp.openConversations} Active Chats</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Bot, 
  ArrowRight, 
  Clock, 
  Layers, 
  Play, 
  CheckCircle2, 
  Sparkles,
  GitBranch,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { ChatbotProject, StarterTemplate } from './types';

interface ChatbotLibraryProps {
  projects: ChatbotProject[];
  templates: StarterTemplate[];
  onSelectProject: (projectId: string) => void;
  onSelectTemplate: (templateId: string) => void;
  onCreateNewProject: () => void;
}

export const ChatbotLibrary: React.FC<ChatbotLibraryProps> = ({
  projects,
  templates,
  onSelectProject,
  onSelectTemplate,
  onCreateNewProject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div 
      id="chatbot-library-view"
      className="flex-1 overflow-y-auto bg-[#F4F5F7] p-6 lg:p-8 space-y-8"
    >
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#5A4AD2] uppercase tracking-wider">
              WhatsApp Automation
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-semibold text-slate-500">
              Visual Conversation Builder
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Chatbot Flow Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Design interactive WhatsApp conversation trees with automated branching, patient questionnaires, and live agent desk routing.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onCreateNewProject}
            className="px-4 py-2.5 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Chatbot</span>
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chatbots by title or intent keywords…"
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['all', 'published', 'draft'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-[#5A4AD2] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: YOUR CHATBOTS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#5A4AD2]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Your Chatbots ({filteredProjects.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((bot) => (
            <div
              key={bot.id}
              onClick={() => onSelectProject(bot.id)}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#5A4AD2]/60 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5A4AD2]/10 text-[#5A4AD2] flex items-center justify-center">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                    bot.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {bot.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#5A4AD2] transition-colors leading-snug">
                  {bot.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {bot.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                  <span className="flex items-center gap-1 font-medium text-slate-600">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    {bot.nodes.length} Steps
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {bot.lastUpdated}
                  </span>
                </div>

                <button
                  type="button"
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 group-hover:bg-[#5A4AD2] group-hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs"
                >
                  <span>Open Flow Builder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: STARTER TEMPLATES */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Starter Templates (Supported Node Types Only)
            </h2>
          </div>
          <span className="text-xs text-slate-400">Pre-built validated flow patterns</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl.id)}
              className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="text-[9px] font-bold text-amber-600 uppercase tracking-wider mb-1">
                  {tpl.category}
                </div>
                <h3 className="font-bold text-xs text-slate-800 group-hover:text-[#5A4AD2] transition-colors leading-snug">
                  {tpl.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>{tpl.nodeCount} Steps</span>
                <span className="font-bold text-[#5A4AD2] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Use <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Bot, Sparkles, Zap, Shield, Play, Settings, BookOpen, MessageSquare, CheckCircle2 } from 'lucide-react';

export const CaptainView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'copilot' | 'documents' | 'scenarios'>('copilot');
  const [testPrompt, setTestPrompt] = useState('How can I confirm my child appointment for this Saturday at Adyar?');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTestRun = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedResponse(
        `Vanakkam! To confirm your appointment for this Saturday at our Adyar Center, please reply with "1 - Confirm" or visit our online appointment desk. Our Adyar team is available from 08:30 AM to 07:30 PM. Floor manager contact: +91 44 2445 0099.`
      );
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Captain AI Hub</h1>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              Copilot Engine
            </span>
          </div>
          <p className="text-xs text-[#6E737F]">
            Operational AI assistant for auto-triage, response enhancements, and grounded clinic knowledge.
          </p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-[#E3E5E9] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('copilot')}
          className={`px-3 py-1.5 rounded-xl transition-colors ${
            activeTab === 'copilot' ? 'bg-[#5A4AD2] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Assistant Playground
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-3 py-1.5 rounded-xl transition-colors ${
            activeTab === 'documents' ? 'bg-[#5A4AD2] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Knowledge Documents (3)
        </button>
        <button
          onClick={() => setActiveTab('scenarios')}
          className={`px-3 py-1.5 rounded-xl transition-colors ${
            activeTab === 'scenarios' ? 'bg-[#5A4AD2] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active Scenarios (6)
        </button>
      </div>

      {/* Content */}
      {activeTab === 'copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Playground input */}
          <div className="bg-white p-5 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#5A4AD2]" />
                Simulate Inbound Inquiry
              </h3>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                Model: Gemini 2.5 Flash
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Inbound WhatsApp Message
              </label>
              <textarea
                rows={4}
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white"
              />
            </div>

            <button
              onClick={handleTestRun}
              disabled={isGenerating}
              className="w-full py-2.5 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Generating Copilot Draft...' : 'Generate Grounded Response'}</span>
            </button>
          </div>

          {/* Response output */}
          <div className="bg-white p-5 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Captain Copilot Suggestion</h3>
            {generatedResponse ? (
              <div className="p-4 bg-[#EEECFB]/40 border border-[#5A4AD2]/30 rounded-xl space-y-3">
                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {generatedResponse}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-[#5A4AD2]/10">
                  <span>Grounded in: Adyar Schedule Handbook</span>
                  <span className="text-emerald-700 font-bold">Confidence: 99.2%</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Click "Generate Grounded Response" to test the Captain AI suggestions.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Clinic Timings & Holiday Calendar 2026', size: '240 KB', updated: 'Yesterday', count: '14 topics' },
            { title: 'Standard Service Packages & Fee Schedule', size: '410 KB', updated: 'Sep 10', count: '28 topics' },
            { title: 'WhatsApp Caregiver FAQ & Rescheduling Guidelines', size: '180 KB', updated: 'Sep 05', count: '42 topics' },
          ].map((doc, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#EEECFB] text-[#5A4AD2] flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                <p className="text-[11px] text-slate-500">{doc.count} • {doc.size}</p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                <span>Updated {doc.updated}</span>
                <span className="text-emerald-700 font-semibold">Indexed</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'scenarios' && (
        <div className="bg-white rounded-2xl border border-[#E3E5E9] p-5 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Active Automated Scenarios</h3>
          <div className="space-y-2 text-xs">
            {[
              { name: 'Off-Hours Inquiry Intake', desc: 'Captures visitor name, phone, branch interest, and schedules follow-up alert.' },
              { name: 'Session Rescheduling Assistance', desc: 'Validates current appointment and proposes alternative open slots.' },
              { name: 'Fee & Billing Inquiry Responder', desc: 'Answers questions regarding consultation charges, receipts, and insurance coverage.' },
            ].map((sc, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{sc.name}</div>
                  <div className="text-[11px] text-slate-500">{sc.desc}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

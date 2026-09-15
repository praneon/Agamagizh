import React, { useState } from 'react';
import { 
  Settings, 
  Inbox, 
  Users, 
  Shield, 
  MessageSquare, 
  Globe, 
  Key, 
  CheckCircle2, 
  Plus, 
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';
import { INBOXES_LIST, AGENTS_LIST } from '../../data/mockData';
import { useCrm } from '../../context/CrmContext';
import { Database, Server, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'inboxes' | 'agents' | 'teams' | 'canned' | 'security' | 'crm_integration'>('inboxes');
  const { mode, setMode, account, clinicalWritesEnabled, refreshContext, isLoading } = useCrm();

  const cannedList = [
    { shortcode: '/greeting', content: 'Vanakkam! Welcome to Agamagizh Child Development Center. How can we support your family today?' },
    { shortcode: '/hours', content: 'Our center timings are Monday to Saturday from 08:30 AM to 07:30 PM.' },
    { shortcode: '/reschedule', content: 'To reschedule your scheduled intake session, please reply with your preferred weekday slot.' },
    { shortcode: '/address', content: 'Agamagizh Center is located at 14/2 Gandhi Nagar 2nd Main Road, Adyar, Chennai 600020.' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Console Workspace Settings</h1>
        <p className="text-xs text-[#6E737F]">
          Manage connected inboxes, team member permissions, automated canned snippets, and security webhooks.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E3E5E9] pb-2 text-xs font-bold overflow-x-auto">
        {[
          { id: 'inboxes' as const, label: 'Inboxes & Channels', count: INBOXES_LIST.length },
          { id: 'agents' as const, label: 'Agents & Roles', count: AGENTS_LIST.length },
          { id: 'teams' as const, label: 'Teams & Routing', count: 3 },
          { id: 'canned' as const, label: 'Canned Responses', count: cannedList.length },
          { id: 'security' as const, label: 'Webhooks & Endpoints' },
          { id: 'crm_integration' as const, label: 'CRM & Data Layer' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'bg-[#5A4AD2] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label} {tab.count !== undefined && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Tab 1: Inboxes */}
      {activeSubTab === 'inboxes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Connected Channels & Inboxes</h3>
            <button className="px-3 py-1.5 bg-[#5A4AD2] text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Channel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INBOXES_LIST.map((ib) => (
              <div key={ib.id} className="bg-white p-5 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#EEECFB] text-[#5A4AD2] flex items-center justify-center font-bold">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{ib.name}</h4>
                  <span className="text-[11px] text-[#5A4AD2] font-semibold block">{ib.phone || ib.email}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="capitalize">{ib.channel}</span>
                  <span className="font-semibold text-slate-800">{ib.openConversationsCount} active chats</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Agents */}
      {activeSubTab === 'agents' && (
        <div className="bg-white rounded-2xl border border-[#E3E5E9] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#E3E5E9] flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Active Team Roster</h3>
            <button className="px-3 py-1.5 bg-[#5A4AD2] text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-[#6E737F] font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {AGENTS_LIST.map((ag) => (
                <tr key={ag.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#5A4AD2] text-white flex items-center justify-center font-bold text-xs">
                      {ag.avatar}
                    </div>
                    <span>{ag.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{ag.email}</td>
                  <td className="py-3 px-4 capitalize font-semibold text-slate-800">{ag.role}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {ag.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-xs font-bold text-[#5A4AD2] hover:underline">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Canned Responses */}
      {activeSubTab === 'canned' && (
        <div className="bg-white rounded-2xl border border-[#E3E5E9] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#E3E5E9] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Saved Canned Responses</h3>
              <p className="text-xs text-slate-500">Insert quick snippets in chat using slash shortcuts</p>
            </div>
            <button className="px-3 py-1.5 bg-[#5A4AD2] text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Canned Reply</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {cannedList.map((item, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1 max-w-2xl">
                  <span className="font-mono font-bold text-[#5A4AD2] bg-[#EEECFB] px-2 py-0.5 rounded text-[11px]">
                    {item.shortcode}
                  </span>
                  <p className="text-slate-700 pt-1 leading-relaxed">{item.content}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Webhooks & Endpoints */}
      {activeSubTab === 'security' && (
        <div className="bg-white rounded-2xl border border-[#E3E5E9] p-5 shadow-2xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Meta Webhooks & Callback Ingestion</h3>
          <p className="text-slate-600">
            Configure this inbound endpoint inside your Meta App Developer Portal under the WhatsApp Cloud API product.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-mono text-[11px]">
            <div>
              <span className="text-slate-400 uppercase font-sans font-bold text-[10px] block">Webhook Callback URL</span>
              <span className="text-slate-800 font-bold">https://api.agamagizh.org/api/webhooks/whatsapp</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-sans font-bold text-[10px] block">Verification Handshake</span>
              <span className="text-slate-600 font-sans">
                Verified server-side via environment variables. Tokens are never exposed to or stored in client bundles.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-700 font-semibold pt-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Webhook endpoint registered and ready for inbound event ingestion</span>
          </div>
        </div>
      )}

      {/* Tab 5: CRM & Data Layer */}
      {activeSubTab === 'crm_integration' && (
        <div className="space-y-5 text-xs">
          {/* Active Data Provider Card */}
          <div className="bg-white rounded-2xl border border-[#E3E5E9] p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-[#5A4AD2]" />
                  <h3 className="text-sm font-bold text-slate-900">CRM & Data Layer Safe Configuration</h3>
                </div>
                <p className="text-slate-500">
                  Real-time status of the active data layer. All sensitive credentials, tokens, and keys remain securely server-side.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => refreshContext()}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh Status</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode(mode === 'local' ? 'real' : 'local')}
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-xs transition-colors ${
                    mode === 'real'
                      ? 'bg-[#5A4AD2] text-white hover:bg-[#4C3DC2]'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <Server className="w-4 h-4" />
                  <span>Switch to {mode === 'local' ? 'Real Chatwoot Rails Mode' : 'Local Demo Mode'}</span>
                </button>
              </div>
            </div>

            {/* Safe Configuration Grid (5 Mandated Safe Properties) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {/* 1. Active Provider Mode */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1. Active Provider Mode</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${mode === 'real' ? 'bg-blue-600' : 'bg-emerald-500'}`} />
                  <span className="font-extrabold text-sm text-slate-900">
                    {mode === 'real' ? 'Real Chatwoot Rails Mode' : 'Local Demo Provider'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {mode === 'real'
                    ? 'Requests routed through /api/v1 backend proxy.'
                    : 'In-memory isolated fixtures. Zero external egress.'}
                </p>
              </div>

              {/* 2. Backend Base URL */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">2. Backend Base URL</span>
                <div className="font-extrabold text-sm text-slate-900 font-mono">
                  {mode === 'real' ? '/api/v1' : 'N/A (Local Provider)'}
                </div>
                <p className="text-[11px] text-slate-500">
                  {mode === 'real'
                    ? 'Safe relative reverse-proxy path. No query tokens.'
                    : 'Local execution engine without external network dependencies.'}
                </p>
              </div>

              {/* 3. Account ID */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">3. Tenant Account ID</span>
                <div className="font-extrabold text-sm text-slate-900">
                  ID #{account?.id || 1} • {account?.name || 'Agamagizh Integrative Health'}
                </div>
                <p className="text-[11px] text-slate-500">
                  Locale: {account?.locale || 'en-IN'} • Timezone: Asia/Kolkata
                </p>
              </div>

              {/* 4. Connection / Health Status */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">4. Connection & Health</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-extrabold text-sm text-emerald-800">
                    {mode === 'local' ? 'Healthy (Operational)' : 'Configured (Standby)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {mode === 'local' ? 'In-memory latency < 1ms' : 'Ready for server-side proxy communication'}
                </p>
              </div>

              {/* 5. Clinical Write-Lock Status */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5 sm:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider">5. Clinical Write-Lock Status</span>
                </div>
                <div className="font-extrabold text-sm text-amber-900">
                  CLINICAL_WRITES_ENABLED: {clinicalWritesEnabled ? 'TRUE' : 'FALSE (LOCKED)'}
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Strict safety guard active. OpenMRS/Bahmni clinical patient records cannot be altered through CRM channels. All patient care chart mutations require direct Bahmni clinical station authorization.
                </p>
              </div>
            </div>
          </div>

          {/* Strict Security Policy Notice */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <Shield className="w-4 h-4 text-[#5A4AD2]" />
              <span>Zero-Secret Client Policy</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              This panel strictly displays non-sensitive operational configuration. Under our healthcare architectural standards, no API access tokens, Meta access tokens, webhook signing secrets, passwords, or private encryption keys are ever transmitted to, persisted in, or exposed by the browser client.
            </p>
          </div>

          {/* Mapped API Contracts Matrix */}
          <div className="bg-white rounded-2xl border border-[#E3E5E9] p-5 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Chatwoot Rails Controllers & Models Mapped
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[11px]">
              {[
                { module: 'Conversations & Messages', endpoint: '/api/v1/accounts/:id/conversations', model: 'Conversation, Message' },
                { module: 'Contacts & Companies', endpoint: '/api/v1/accounts/:id/contacts', model: 'Contact, ContactInbox' },
                { module: 'Clinic Pipeline (Kanban)', endpoint: '/api/v1/accounts/:id/clinic_pipelines', model: 'ClinicPipelineCard (with lock_version)' },
                { module: 'Broadcast Campaigns', endpoint: '/api/v1/accounts/:id/campaigns', model: 'Campaign, CampaignRecipient' },
                { module: 'Preflight Safety Engine', endpoint: '/api/v1/accounts/:id/campaigns/preflight_preview', model: 'Whatsapp::CampaignPreflightService' },
                { module: 'Chatbot Automations', endpoint: '/api/v1/accounts/:id/automation_flows', model: 'AutomationFlow, GraphValidator' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                  <span className="font-bold text-slate-800 block">{item.module}</span>
                  <code className="text-[10px] text-[#5A4AD2] font-mono block truncate">{item.endpoint}</code>
                  <span className="text-[10px] text-slate-500 block">Rails Model: {item.model}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { INBOXES_LIST } from '../../../data/mockData';
import { Building2, MessageSquare, AlertCircle, Info, ShieldCheck } from 'lucide-react';

interface Step1DetailsProps {
  name: string;
  onChangeName: (val: string) => void;
  channelInbox: string;
  onChangeChannelInbox: (val: string) => void;
  showErrors?: boolean;
}

export const Step1Details: React.FC<Step1DetailsProps> = ({
  name,
  onChangeName,
  channelInbox,
  onChangeChannelInbox,
  showErrors
}) => {
  const whatsappInboxes = INBOXES_LIST.filter(ib => ib.channel === 'whatsapp');
  const isNameEmpty = showErrors && !name.trim();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Campaign Details</h3>
        <p className="text-xs text-slate-500 mt-1">
          Provide a canonical campaign name and select the verified WhatsApp sender identity.
        </p>
      </div>

      <div className="space-y-4">
        {/* Campaign Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Campaign Name <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">Internal operational reference</span>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="e.g. Center Schedule Update — October 2026"
            className={`w-full text-xs px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white transition-all ${
              isNameEmpty ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
            }`}
          />
          {isNameEmpty && (
            <p className="text-[11px] text-red-600 font-semibold mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Campaign name is required to proceed.
            </p>
          )}
        </div>

        {/* WhatsApp Connected Inbox */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700">
              WhatsApp Connected Inbox / Sender <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Meta Cloud API
            </span>
          </div>
          <select
            value={channelInbox}
            onChange={(e) => onChangeChannelInbox(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white transition-all cursor-pointer"
          >
            {whatsappInboxes.map((ib) => (
              <option key={ib.id} value={ib.name}>
                {ib.name} — {ib.phone} (Quality Tier: High)
              </option>
            ))}
          </select>
          <div className="flex items-start gap-2 mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              All broadcast dispatches are routed through this registered Meta Business account. Rate limits and sending tiers are enforced by Meta WhatsApp Cloud API.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

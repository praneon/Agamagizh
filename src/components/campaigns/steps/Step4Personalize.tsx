import React from 'react';
import { WhatsAppTemplate } from '../../../types';
import { CampaignVariableMapping, VariableMappingSource } from '../types';
import { Sparkles, MessageSquare, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface Step4PersonalizeProps {
  template: WhatsAppTemplate;
  mappings: Record<string, CampaignVariableMapping>;
  onChangeMapping: (token: string, mapping: CampaignVariableMapping) => void;
  showErrors?: boolean;
}

const SUPPORTED_CONTACT_ATTRIBUTES = [
  { id: 'preferred_language', label: 'Preferred Language (e.g. English, Tamil)' },
  { id: 'client_tier', label: 'Client Tier (e.g. VIP, Standard)' },
  { id: 'referral_source', label: 'Referral Source (e.g. Doctor Referral)' },
  { id: 'registered_branch', label: 'Registered Branch (e.g. Adyar Hub)' }
];

export const Step4Personalize: React.FC<Step4PersonalizeProps> = ({
  template,
  mappings,
  onChangeMapping,
  showErrors
}) => {
  // Extract all tokens like {{1}}, {{2}}
  const tokens: string[] = Array.from(new Set<string>(template.body.match(/\{\{\d+\}\}/g) || [])).sort();

  const handleSourceChange = (token: string, source: VariableMappingSource) => {
    let exampleValue = '';
    if (source === 'contact_name') exampleValue = 'Meera Sundaram';
    else if (source === 'phone_number') exampleValue = '+91 98401 22345';
    else if (source === 'email') exampleValue = 'meera.s@gmail.com';
    else if (source === 'contact_attribute') exampleValue = 'Adyar Main Hub';
    else if (source === 'static_value') exampleValue = mappings[token]?.staticValue || 'Agamagizh Center';

    onChangeMapping(token, {
      token,
      source,
      attributeName: source === 'contact_attribute' ? SUPPORTED_CONTACT_ATTRIBUTES[0].id : undefined,
      staticValue: source === 'static_value' ? (mappings[token]?.staticValue || 'Agamagizh Center') : undefined,
      exampleValue
    });
  };

  const handleStaticValueChange = (token: string, val: string) => {
    onChangeMapping(token, {
      ...mappings[token],
      staticValue: val,
      exampleValue: val || '—'
    });
  };

  const handleAttributeChange = (token: string, attrId: string) => {
    let example = 'Adyar Hub';
    if (attrId === 'preferred_language') example = 'Tamil';
    if (attrId === 'client_tier') example = 'VIP';
    if (attrId === 'referral_source') example = 'Direct Consultation';

    onChangeMapping(token, {
      ...mappings[token],
      attributeName: attrId,
      exampleValue: example
    });
  };

  // Interpolate body for live preview
  let previewText = template.body;
  tokens.forEach((tok) => {
    const map = mappings[tok];
    const val = map?.exampleValue || tok;
    previewText = previewText.replaceAll(tok, `[${val}]`);
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Personalize Template Variables</h3>
        <p className="text-xs text-slate-500 mt-1">
          Map variables in <span className="font-mono font-bold text-[#5A4AD2]">{template.name}</span> to verified contact data fields or static text.
        </p>
      </div>

      {tokens.length === 0 ? (
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          This approved template has no variable placeholders. No personalization mapping required.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Mappings Form (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-slate-900 block">Variable Field Mappings</span>

            {tokens.map((token, idx) => {
              const current = mappings[token] || {
                token,
                source: idx === 0 ? 'contact_name' : idx === 1 ? 'contact_attribute' : 'static_value',
                exampleValue: idx === 0 ? 'Meera Sundaram' : '15 Oct 2026'
              };
              const isMissingStatic = current.source === 'static_value' && !current.staticValue?.trim();
              const hasError = showErrors && isMissingStatic;

              return (
                <div
                  key={token}
                  className={`p-4 bg-white rounded-2xl border transition-all space-y-3 ${
                    hasError ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#EEECFB] text-[#5A4AD2] font-mono font-bold text-xs rounded-lg border border-[#5A4AD2]/20">
                        {token}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        Variable #{idx + 1}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Required</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Map to Data Source
                      </label>
                      <select
                        value={current.source}
                        onChange={(e) => handleSourceChange(token, e.target.value as VariableMappingSource)}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white"
                      >
                        <option value="contact_name">Contact Full Name (e.g. Meera Sundaram)</option>
                        <option value="phone_number">Contact Phone Number (e.g. +91 98401 22345)</option>
                        <option value="email">Contact Email (e.g. meera@domain.com)</option>
                        <option value="contact_attribute">Supported Contact Attribute</option>
                        <option value="static_value">Static Value (Same for all recipients)</option>
                      </select>
                    </div>

                    {current.source === 'contact_attribute' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Select Attribute
                        </label>
                        <select
                          value={current.attributeName || SUPPORTED_CONTACT_ATTRIBUTES[0].id}
                          onChange={(e) => handleAttributeChange(token, e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
                        >
                          {SUPPORTED_CONTACT_ATTRIBUTES.map(attr => (
                            <option key={attr.id} value={attr.id}>{attr.label}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {current.source === 'static_value' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Static Text Value <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={current.staticValue || ''}
                          onChange={(e) => handleStaticValueChange(token, e.target.value)}
                          placeholder="e.g. 10:00 AM to 02:00 PM"
                          className={`w-full text-xs p-2 bg-white border rounded-xl focus:ring-2 focus:ring-[#5A4AD2] ${
                            hasError ? 'border-red-400' : 'border-slate-200'
                          }`}
                        />
                        {hasError && (
                          <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Variable {token} needs a value.
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Sample Interpolation:</span>
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        "{current.exampleValue}"
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Personalization Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold text-slate-900 block">Personalization Preview</span>

            <div className="bg-[#EFEAE2] p-4 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="bg-white rounded-2xl p-4 shadow-2xs space-y-3 text-xs">
                {template.header && template.header.type === 'text' && (
                  <div className="font-extrabold text-slate-900 pb-2 border-b border-slate-100 text-xs">
                    {template.header.text}
                  </div>
                )}

                <div className="text-slate-800 leading-relaxed whitespace-pre-wrap font-sans text-xs">
                  {previewText.split(/(\[.*?\])/g).map((part, i) => {
                    if (part.startsWith('[') && part.endsWith(']')) {
                      return (
                        <span key={i} className="font-bold text-[#5A4AD2] bg-[#EEECFB] px-1 py-0.5 rounded mx-0.5">
                          {part.slice(1, -1)}
                        </span>
                      );
                    }
                    return part;
                  })}
                </div>

                {template.footer && (
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    {template.footer}
                  </div>
                )}

                {template.buttons && template.buttons.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    {template.buttons.map((btn, bidx) => (
                      <div
                        key={bidx}
                        className="py-1.5 px-3 bg-slate-50 rounded-xl text-center font-bold text-[#5A4AD2] text-xs border border-slate-200/60 shadow-2xs"
                      >
                        {btn.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-500 text-center block mt-2">
                Simulated sample recipient view (Meera Sundaram)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { X, Check, ShieldCheck, Phone, CheckCircle2, ArrowRight, Building, Key } from 'lucide-react';

interface WhatsAppEmbeddedSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const WhatsAppEmbeddedSignupModal: React.FC<WhatsAppEmbeddedSignupModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<number>(1);
  const [businessName, setBusinessName] = useState('Agamagizh Child Development Center');
  const [phoneNumber, setPhoneNumber] = useState('+91 98401 98401');
  const [wabaId, setWabaId] = useState('109283746192840');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
    }, 700);
  };

  const handleComplete = () => {
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E3E5E9] flex items-center justify-between bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                Meta Embedded Signup
              </span>
              <h2 className="text-sm font-extrabold text-slate-900">Connect Official WhatsApp Business</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {step === 1 && (
            <div className="space-y-3.5">
              <p className="text-slate-600">
                Provision your official WhatsApp Cloud API number directly under your Meta Business Manager.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Legal Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Business Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Meta WABA Account ID</label>
                <input
                  type="text"
                  value={wabaId}
                  onChange={(e) => setWabaId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <span>Request Verification Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">Enter 6-Digit Meta Verification Code</h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Sent via SMS / Voice call to <span className="font-bold text-slate-800">{phoneNumber}</span>
                </p>
              </div>

              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="• • • • • •"
                className="w-48 text-center text-xl tracking-widest font-mono py-2 bg-slate-50 border border-slate-300 rounded-xl mx-auto block focus:outline-none focus:ring-2 focus:ring-[#5A4AD2]"
              />

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifying}
                  className="px-5 py-2 bg-[#5A4AD2] hover:bg-[#4C3DC2] text-white font-bold rounded-xl shadow-xs"
                >
                  {isVerifying ? 'Verifying with Meta...' : 'Confirm Registration'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center py-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base">WhatsApp Number Connected!</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Your phone number is active and connected to Agamagizh Console via Meta Cloud API v20.0 with Tier 2 messaging capacity.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-left border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span className="font-bold text-slate-800">{phoneNumber}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Quality:</span><span className="font-bold text-emerald-700">HIGH (Green)</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Webhook Status:</span><span className="font-bold text-emerald-700">Healthy (200 OK)</span></div>
              </div>

              <button
                type="button"
                onClick={handleComplete}
                className="w-full py-2.5 bg-[#5A4AD2] text-white font-bold rounded-xl shadow-xs"
              >
                Go to WhatsApp Hub
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { CampaignScheduleMode } from '../types';
import { Send, Calendar, Clock, Globe, AlertCircle, Info, Check } from 'lucide-react';

interface Step5ScheduleProps {
  scheduleMode: CampaignScheduleMode;
  onChangeScheduleMode: (mode: CampaignScheduleMode) => void;
  scheduleDate: string;
  onChangeScheduleDate: (date: string) => void;
  scheduleTime: string;
  onChangeScheduleTime: (time: string) => void;
  scheduleTimezone: string;
  onChangeScheduleTimezone: (tz: string) => void;
  showErrors?: boolean;
}

export const Step5Schedule: React.FC<Step5ScheduleProps> = ({
  scheduleMode,
  onChangeScheduleMode,
  scheduleDate,
  onChangeScheduleDate,
  scheduleTime,
  onChangeScheduleTime,
  scheduleTimezone,
  onChangeScheduleTimezone,
  showErrors
}) => {
  // Validate if scheduled date/time is in the future
  const isFuture = () => {
    if (scheduleMode === 'send_now') return true;
    if (!scheduleDate || !scheduleTime) return false;
    const chosen = new Date(`${scheduleDate}T${scheduleTime}`);
    return chosen.getTime() > Date.now();
  };

  const isScheduleInvalid = showErrors && scheduleMode === 'schedule_later' && !isFuture();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Campaign Schedule</h3>
        <p className="text-xs text-slate-500 mt-1">
          Specify whether to start dispatch queue immediately following preflight verification or queue for a future date.
        </p>
      </div>

      <div className="space-y-3">
        {/* Option 1: SEND NOW */}
        <div
          onClick={() => onChangeScheduleMode('send_now')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            scheduleMode === 'send_now'
              ? 'bg-[#EEECFB] border-[#5A4AD2] shadow-xs ring-1 ring-[#5A4AD2]'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                scheduleMode === 'send_now' ? 'bg-[#5A4AD2] text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <Send className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">Send Now</span>
                <span className="text-[11px] text-slate-500">
                  Begin outbound dispatch queue immediately after campaign review and Canonical Preflight pass.
                </span>
              </div>
            </div>
            {scheduleMode === 'send_now' && (
              <div className="w-5 h-5 rounded-full bg-[#5A4AD2] text-white flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>

        {/* Option 2: SCHEDULE LATER */}
        <div
          onClick={() => onChangeScheduleMode('schedule_later')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            scheduleMode === 'schedule_later'
              ? 'bg-[#EEECFB] border-[#5A4AD2] shadow-xs ring-1 ring-[#5A4AD2]'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                scheduleMode === 'schedule_later' ? 'bg-[#5A4AD2] text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">Schedule for Later</span>
                <span className="text-[11px] text-slate-500">
                  Hold in scheduled state until designated calendar date and time.
                </span>
              </div>
            </div>
            {scheduleMode === 'schedule_later' && (
              <div className="w-5 h-5 rounded-full bg-[#5A4AD2] text-white flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* Date / Time / Timezone Pickers */}
          {scheduleMode === 'schedule_later' && (
            <div className="mt-4 pt-4 border-t border-[#5A4AD2]/20 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Dispatch Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => onChangeScheduleDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5A4AD2]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Dispatch Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => onChangeScheduleTime(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5A4AD2]"
                  />
                </div>
              </div>

              {/* Explicit Timezone Indicator */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Timezone (Fixed by Connected Inbox)
                </label>
                <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700">
                  <Globe className="w-4 h-4 text-[#5A4AD2]" />
                  <span className="font-semibold">{scheduleTimezone}</span>
                  <span className="text-[11px] text-slate-400 ml-auto">(UTC+05:30)</span>
                </div>
              </div>

              {isScheduleInvalid && (
                <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                  Scheduled time must be in the future. Please select a valid upcoming time.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          Campaigns scheduled for later remain in <strong>Scheduled</strong> status and will automatically execute preflight refresh 15 minutes prior to release.
        </span>
      </div>
    </div>
  );
};

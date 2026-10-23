import React, { useState } from 'react';
import { Play, Clock, User, Sparkles, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SESSION_MODES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export function StartSessionModal({ device, isOpen, onClose }) {
  const { startSession } = useApp();

  const [sessionType, setSessionType] = useState('open'); // open or fixed
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [mode, setMode] = useState('single');
  const [customerName, setCustomerName] = useState('');

  if (!device) return null;

  const currentRate = device.rates?.[mode] || device.rates?.single || 40;

  const presets = [
    { label: '30 دقيقة', val: 30 },
    { label: '1 ساعة', val: 60 },
    { label: '1.5 ساعة', val: 90 },
    { label: '2 ساعة', val: 120 },
    { label: '3 ساعات', val: 180 },
  ];

  const handleStart = (e) => {
    e.preventDefault();
    startSession(device.id, {
      type: sessionType,
      durationMinutes: sessionType === 'fixed' ? Number(durationMinutes) : null,
      mode,
      customerName: customerName.trim() || 'عميل كاش',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`بدء جلسة جديدة: ${device.name}`}
      subtitle="حدد نظام الوقت ونمط اللعب واسم العميل"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleStart} className="space-y-4">
        {/* Session Type Switcher */}
        <div className="space-y-1.5 text-right">
          <label className="text-xs font-semibold text-slate-300">نظام الوقت:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSessionType('open')}
              className={`
                p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer
                ${
                  sessionType === 'open'
                    ? 'bg-emerald-500/15 border-emerald-500/60 text-white font-bold shadow-sm'
                    : 'bg-[#0F131D] border-[#232C42] text-slate-400 hover:border-slate-600'
                }
              `}
            >
              <Clock className={`w-5 h-5 ${sessionType === 'open' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-sm">وقت مفتوح</span>
              <span className="text-[10px] text-slate-400 font-normal">يحسب حسب الدقائق الملعوبة</span>
            </button>

            <button
              type="button"
              onClick={() => setSessionType('fixed')}
              className={`
                p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer
                ${
                  sessionType === 'fixed'
                    ? 'bg-violet-500/15 border-violet-500/60 text-white font-bold shadow-sm'
                    : 'bg-[#0F131D] border-[#232C42] text-slate-400 hover:border-slate-600'
                }
              `}
            >
              <Sparkles className={`w-5 h-5 ${sessionType === 'fixed' ? 'text-violet-400' : 'text-slate-400'}`} />
              <span className="text-sm">وقت محدد (مؤقت)</span>
              <span className="text-[10px] text-slate-400 font-normal">ينبه عند انتهاء الوقت</span>
            </button>
          </div>
        </div>

        {/* Fixed Time Presets if Fixed */}
        {sessionType === 'fixed' && (
          <div className="space-y-2 p-3 bg-[#0F131D] border border-[#232C42] rounded-xl text-right animate-in fade-in">
            <label className="text-xs font-semibold text-slate-300">اختر المدة:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setDurationMinutes(p.val)}
                  className={`
                    py-2 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer
                    ${
                      durationMinutes === p.val
                        ? 'bg-violet-600 text-white border-violet-400'
                        : 'bg-[#181E2F] border-[#232C42] text-slate-300 hover:border-slate-600'
                    }
                  `}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="pt-1">
              <Input
                label="أو حدد بالدقائق يدوياً:"
                type="number"
                min="5"
                max="600"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
              />
            </div>
          </div>
        )}

        {/* Mode Selector */}
        <div className="space-y-1.5 text-right">
          <label className="text-xs font-semibold text-slate-300">نمط اللعب:</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(SESSION_MODES).map(([modeKey, modeInfo]) => (
              <button
                key={modeKey}
                type="button"
                onClick={() => setMode(modeKey)}
                className={`
                  p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer
                  ${
                    mode === modeKey
                      ? 'bg-violet-600/20 border-violet-500 text-white font-bold'
                      : 'bg-[#0F131D] border-[#232C42] text-slate-400 hover:border-slate-600'
                  }
                `}
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs">{modeInfo.label}</span>
                  {mode === modeKey && <Check className="w-3.5 h-3.5 text-violet-400" />}
                </div>
                <span className="text-[11px] text-emerald-400 font-mono-numbers">
                  {device.rates?.[modeKey] || device.rates?.single || 40} ج.م / س
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Customer Name */}
        <Input
          label="اسم العميل (اختياري):"
          placeholder="مثال: أحمد، كابتن محمود..."
          icon={User}
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        {/* Pricing Notice */}
        <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 flex items-center justify-between text-xs">
          <span className="text-slate-300">سعر الساعة المحدد:</span>
          <span className="text-sm font-bold text-emerald-400 font-mono-numbers">
            {formatCurrency(currentRate)} / ساعة
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            type="submit"
            variant="success"
            fullWidth
            size="lg"
            icon={Play}
          >
            بدء اللعب وتشغيل المؤقت
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            size="lg"
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
}

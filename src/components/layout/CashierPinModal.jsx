import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export function CashierPinModal() {
  const {
    staffPinModalOpen,
    setStaffPinModalOpen,
    staff,
    activeStaffMember,
    switchStaffMember,
    settings,
  } = useApp();

  const { playTone } = useAudio();
  const [selectedStaffId, setSelectedStaffId] = useState(activeStaffMember.id);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const targetStaff = staff.find((s) => s.id === selectedStaffId) || staff[0];

  const handleNumClick = (digit) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
      setError('');
      playTone('click');
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
    playTone('click');
  };

  const handleClear = () => {
    setPin('');
    setError('');
    playTone('click');
  };

  const handleConfirm = () => {
    const isMasterPin = Boolean(settings?.defaultPin && pin === String(settings.defaultPin));
    if (pin === targetStaff.pin || isMasterPin) {
      switchStaffMember(targetStaff.id);
      setPin('');
      setError('');
      setStaffPinModalOpen(false);
      playTone('success');
    } else {
      setError('رمز PIN غير صحيح! حاول مرة أخرى');
      playTone('warning');
    }
  };

  const handleClose = () => {
    setPin('');
    setError('');
    setStaffPinModalOpen(false);
  };

  return (
    <Modal
      isOpen={staffPinModalOpen}
      onClose={handleClose}
      title="تبديل الكاشير / تسجيل الدخول"
      subtitle="اختر الموظف وأدخل رمز PIN للمتابعة"
      maxWidth="max-w-sm"
    >
      <div className="space-y-4">
        {/* Staff selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            اختر الموظف:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {staff.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedStaffId(s.id);
                  setPin('');
                  setError('');
                }}
                className={`
                  flex items-center justify-between p-3 rounded-xl border text-right transition-all cursor-pointer
                  ${
                    selectedStaffId === s.id
                      ? 'bg-violet-600/15 border-violet-500/50 text-white font-bold'
                      : 'bg-[#0F131D] border-[#232C42] text-slate-300 hover:border-slate-600'
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs">{s.name}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{s.role}</p>
                  </div>
                </div>
                {selectedStaffId === s.id && (
                  <Check className="w-4 h-4 text-violet-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* PIN display dots */}
        <div className="py-2 text-center">
          <p className="text-xs text-slate-400 mb-2">أدخل الرمز المكون من 4 أرقام (الافتراضي 1234):</p>
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`
                  w-4 h-4 rounded-full border transition-all duration-150
                  ${
                    pin.length > idx
                      ? 'bg-violet-500 border-violet-400 shadow-[0_0_8px_#7C3AED]'
                      : 'bg-slate-800 border-slate-700'
                  }
                `}
              />
            ))}
          </div>
          {error && <p className="text-xs text-rose-400 font-semibold mt-2">{error}</p>}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 text-center" dir="ltr">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleNumClick(num)}
              className="py-3 rounded-xl bg-[#0F131D] hover:bg-slate-800 border border-[#232C42] text-white font-bold text-lg transition-colors cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-[#232C42] text-slate-400 text-xs font-semibold transition-colors cursor-pointer"
          >
            مسح
          </button>
          <button
            onClick={() => handleNumClick('0')}
            className="py-3 rounded-xl bg-[#0F131D] hover:bg-slate-800 border border-[#232C42] text-white font-bold text-lg transition-colors cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-[#232C42] text-slate-400 text-xs font-semibold transition-colors cursor-pointer"
          >
            ⌫
          </button>
        </div>

        <Button
          fullWidth
          variant="primary"
          onClick={handleConfirm}
          disabled={pin.length < 4}
          size="md"
        >
          تأكيد الدخول
        </Button>
      </div>
    </Modal>
  );
}

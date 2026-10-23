import React, { useState } from 'react';
import { ArrowLeftRight, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export function TransferModal({ device, isOpen, onClose }) {
  const { devices, transferSession } = useApp();
  const [selectedTargetId, setSelectedTargetId] = useState('');

  if (!device || !device.activeSession) return null;

  // Only available devices
  const availableDevices = devices.filter(
    (d) => d.id !== device.id && d.status === 'available'
  );

  const handleTransfer = () => {
    if (!selectedTargetId) return;
    const success = transferSession(device.id, selectedTargetId);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`نقل الجلسة: ${device.name}`}
      subtitle={`العميل: ${device.activeSession.customerName} - نقل الوقت والطلبات لجهاز متاح`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {availableDevices.length === 0 ? (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>لا توجد أجهزة متاحة حالياً للنقل إليها! جميع الأجهزة الأخرى مشغولة.</span>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block text-right">
              اختر الجهاز البديل المراد النقل إليه:
            </label>
            <div className="max-h-60 overflow-y-auto space-y-1.5">
              {availableDevices.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => setSelectedTargetId(target.id)}
                  className={`
                    w-full p-3 rounded-xl border flex items-center justify-between text-right transition-all cursor-pointer
                    ${
                      selectedTargetId === target.id
                        ? 'bg-cyan-950/30 border-cyan-500 text-white font-bold'
                        : 'bg-[#0F131D] border-[#232C42] text-slate-300 hover:border-slate-600'
                    }
                  `}
                >
                  <div>
                    <p className="text-sm">{target.name}</p>
                    <p className="text-[11px] text-slate-400">{target.screenSize}</p>
                  </div>
                  {selectedTargetId === target.id && (
                    <Check className="w-4 h-4 text-cyan-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button
            type="button"
            variant="cyan"
            fullWidth
            size="md"
            icon={ArrowLeftRight}
            disabled={!selectedTargetId}
            onClick={handleTransfer}
          >
            تأكيد النقل الآن
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            إلغاء
          </Button>
        </div>
      </div>
    </Modal>
  );
}

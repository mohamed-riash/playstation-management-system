import React, { useState, useEffect } from 'react';
import {
  Receipt,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Clock,
  Coffee,
  Percent,
  Calculator,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDurationHuman } from '../../utils/formatters';
import { PAYMENT_METHODS, SESSION_MODES } from '../../utils/constants';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export function CheckoutModal({ device, sessionData, isOpen, onClose }) {
  const { checkoutSession, settings } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');

  const session = device?.activeSession;

  useEffect(() => {
    if (session) {
      setCustomerName(session.customerName || '');
      setPaidAmount('');
      setDiscount(0);
    }
  }, [session, isOpen]);

  if (!device || !session || !isOpen) return null;

  const deviceCost = Number(sessionData?.timeCost) || 0;
  const cafeCost = Number(sessionData?.ordersTotal) || 0;
  const durationSeconds = Number(sessionData?.elapsedSeconds) || 0;

  const subtotal = deviceCost + cafeCost;
  const effectiveDiscount = Math.min(subtotal, Math.max(0, Number(discount) || 0));
  const finalTotal = Math.max(0, subtotal - effectiveDiscount);

  const numericPaid = paidAmount === '' ? finalTotal : Number(paidAmount);
  const changeDue = Math.max(0, numericPaid - finalTotal);

  const handleFinishCheckout = (e) => {
    e.preventDefault();

    const invoiceItems = [
      {
        name: `جلسة ${device.name} (${SESSION_MODES[session.mode]?.label} - ${formatDurationHuman(durationSeconds)})`,
        price: deviceCost,
        qty: 1,
      },
      ...(session.orders || []).map((o) => ({
        name: o.name,
        price: o.price,
        qty: o.qty,
      })),
    ];

    checkoutSession(device.id, {
      durationSeconds,
      deviceCost,
      cafeCost,
      discount: effectiveDiscount,
      total: finalTotal,
      paymentMethod,
      paidAmount: numericPaid,
      changeDue,
      customerName,
      items: invoiceItems,
      notes,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`حساب وإنهاء الجلسة: ${device.name}`}
      subtitle="مراجعة التكلفة والطلبات وطريقة الدفع وطباعة الفاتورة"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleFinishCheckout} className="space-y-4">
        {/* Customer name edit */}
        <Input
          label="اسم العميل على الفاتورة:"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        {/* Itemized Session Breakdown */}
        <div className="p-3.5 bg-[#0E121C] border border-[#232C42] rounded-xl space-y-2.5">
          <p className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-violet-400" />
            تفاصيل الحساب:
          </p>

          {/* Time component */}
          <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#1F273E]">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-200">
                وقت اللعب ({SESSION_MODES[session.mode]?.label} - {formatDurationHuman(durationSeconds)}):
              </span>
            </div>
            <span className="font-bold text-white font-mono-numbers">
              {formatCurrency(deviceCost)}
            </span>
          </div>

          {/* Cafe items list */}
          {(session.orders || []).length > 0 ? (
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Coffee className="w-3 h-3 text-amber-400" />
                طلبات الكافيه:
              </p>
              {session.orders.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs pr-4 text-slate-300"
                >
                  <span>
                    {item.qty}x {item.name}
                  </span>
                  <span className="font-mono-numbers text-slate-300">
                    {formatCurrency(item.price * item.qty)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs pt-1 text-slate-300">
                <span className="text-slate-400">إجمالي الكافيه:</span>
                <span className="font-bold text-amber-400 font-mono-numbers">
                  {formatCurrency(cafeCost)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">لا توجد طلبات كافيه مضافة لهذه الجلسة.</p>
          )}

          {/* Subtotal */}
          <div className="pt-2 border-t border-[#1F273E] flex items-center justify-between text-xs">
            <span className="text-slate-400">المجموع الفرعي:</span>
            <span className="font-bold text-white font-mono-numbers">
              {formatCurrency(subtotal)}
            </span>
          </div>
        </div>

        {/* Discount & Adjustments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="الخصم (ج.م):"
            type="number"
            min="0"
            max={subtotal}
            icon={Percent}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />

          {/* Payment Method */}
          <div className="space-y-1.5 text-right">
            <label className="block text-xs font-semibold text-slate-300">
              طريقة الدفع:
            </label>
            <div className="grid grid-cols-3 gap-1">
              {Object.entries(PAYMENT_METHODS).map(([key, info]) => {
                const Icon =
                  key === 'cash' ? Banknote : key === 'card' ? CreditCard : Smartphone;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPaymentMethod(key)}
                    className={`
                      py-2 px-1 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer
                      ${
                        paymentMethod === key
                          ? 'bg-violet-600/25 border-violet-500 text-white'
                          : 'bg-[#0F131D] border-[#232C42] text-slate-400 hover:border-slate-600'
                      }
                    `}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{key === 'cash' ? 'نقدي' : key === 'card' ? 'فيزا' : 'محفظة'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cash Calculation helper (if paying cash) */}
        {paymentMethod === 'cash' && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#0F131D] border border-[#232C42] rounded-xl text-xs">
            <div>
              <Input
                label="المبلغ المستلم من العميل:"
                type="number"
                min="0"
                placeholder={String(finalTotal)}
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-col justify-center text-right space-y-1">
              <span className="text-slate-400">الباقي للعميل:</span>
              <span className="text-lg font-black text-emerald-400 font-mono-numbers">
                {formatCurrency(changeDue)}
              </span>
            </div>
          </div>
        )}

        {/* Grand Total Bar */}
        <div className="p-4 bg-gradient-to-r from-violet-950/40 via-indigo-950/40 to-slate-900 border border-violet-500/40 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-300 font-semibold">المبلغ النهائي المطلوب للدفع:</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              طريقة الدفع: {PAYMENT_METHODS[paymentMethod]?.label}
            </p>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono-numbers">
            {formatCurrency(finalTotal)}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            type="submit"
            variant="success"
            fullWidth
            size="lg"
            icon={CheckCircle2}
            className="font-bold text-sm"
          >
            تأكيد الدفع وإصدار الفاتورة ({formatCurrency(finalTotal)})
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onClose}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
}

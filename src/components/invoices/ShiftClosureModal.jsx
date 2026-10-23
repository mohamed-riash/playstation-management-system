import React, { useState } from 'react';
import {
  Power,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';

export function ShiftClosureModal() {
  const {
    shiftClosureModalOpen,
    setShiftClosureModalOpen,
    currentShift,
    invoices,
    expenses,
    closeShift,
  } = useApp();

  const [countedCash, setCountedCash] = useState('');
  const [notes, setNotes] = useState('');
  const [closedReport, setClosedReport] = useState(null);

  if (!shiftClosureModalOpen) return null;

  // Calculate shift metrics dynamically
  const shiftStart = new Date(currentShift.startTime).getTime();
  const shiftInvoices = invoices.filter(
    (inv) => new Date(inv.date).getTime() >= shiftStart
  );
  const shiftExpenses = expenses.filter(
    (exp) => new Date(exp.date).getTime() >= shiftStart
  );

  const totalCashSales = shiftInvoices
    .filter((i) => i.paymentMethod === 'cash')
    .reduce((sum, i) => sum + i.total, 0);

  const totalCardSales = shiftInvoices
    .filter((i) => i.paymentMethod === 'card')
    .reduce((sum, i) => sum + i.total, 0);

  const totalWalletSales = shiftInvoices
    .filter((i) => i.paymentMethod === 'wallet')
    .reduce((sum, i) => sum + i.total, 0);

  const totalExpensesAmount = shiftExpenses.reduce((sum, e) => sum + e.amount, 0);

  const startingCash = Number(currentShift.startingCash) || 0;
  const expectedCashInDrawer = startingCash + totalCashSales - totalExpensesAmount;

  const actualCash = countedCash === '' ? 0 : Number(countedCash);
  const discrepancy = actualCash - expectedCashInDrawer;

  const handleConfirmClose = (e) => {
    e.preventDefault();
    const result = closeShift({
      countedCash: actualCash,
      notes,
    });
    setClosedReport(result);
  };

  const handleFinishAndExit = () => {
    setClosedReport(null);
    setCountedCash('');
    setNotes('');
    setShiftClosureModalOpen(false);
  };

  return (
    <Modal
      isOpen={shiftClosureModalOpen}
      onClose={handleFinishAndExit}
      title="تقفيل الوردية الحالية (تقرير Z-Report)"
      subtitle={`وردية رقم #${currentShift.shiftNumber || 1} - الكاشير: ${currentShift.cashierName}`}
      maxWidth="max-w-lg"
    >
      {closedReport ? (
        /* Closure Success Summary View */
        <div className="space-y-4 text-right">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">تم تقفيل الوردية بنجاح!</h3>
            <p className="text-xs text-slate-300">
              تم ترحيل بيانات الوردية إلى الأرشيف، وبدء وردية جديدة بالرصيد الفعلي الحالي ({formatCurrency(closedReport.actualCash)}).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0E121C] border border-[#232C42] space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#1F273E]">
              <span className="text-slate-400">إجمالي المبيعات (الكل):</span>
              <span className="font-bold text-white font-mono-numbers">{formatCurrency(closedReport.totalRevenue)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1F273E]">
              <span className="text-slate-400">مبيعات الكاش:</span>
              <span className="font-bold text-emerald-400 font-mono-numbers">{formatCurrency(closedReport.totalCashSales)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1F273E]">
              <span className="text-slate-400">مبيعات الفيزا والبطاقات:</span>
              <span className="font-bold text-violet-400 font-mono-numbers">{formatCurrency(closedReport.totalCardSales)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1F273E]">
              <span className="text-slate-400">مبيعات المحافظ الإلكترونية:</span>
              <span className="font-bold text-cyan-400 font-mono-numbers">{formatCurrency(closedReport.totalWalletSales)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1F273E]">
              <span className="text-slate-400">إجمالي المصروفات المسحوبة:</span>
              <span className="font-bold text-rose-400 font-mono-numbers">-{formatCurrency(closedReport.totalExpensesAmount)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1F273E]">
              <span className="text-slate-400">الكاش الفعلي المسلم:</span>
              <span className="font-bold text-white font-mono-numbers text-sm">{formatCurrency(closedReport.actualCash)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">الفارق (عجز / زيادة):</span>
              <span
                className={`font-black font-mono-numbers ${
                  closedReport.discrepancy === 0
                    ? 'text-emerald-400'
                    : closedReport.discrepancy > 0
                    ? 'text-cyan-400'
                    : 'text-rose-400'
                }`}
              >
                {closedReport.discrepancy > 0 ? '+' : ''}
                {formatCurrency(closedReport.discrepancy)}
              </span>
            </div>
          </div>

          <Button fullWidth variant="primary" size="md" onClick={handleFinishAndExit}>
            تم والمتابعة للوردية الجديدة
          </Button>
        </div>
      ) : (
        /* Pre-closure calculation form */
        <form onSubmit={handleConfirmClose} className="space-y-4 text-right">
          {/* Shift Details Banner */}
          <div className="p-3 bg-[#0E121C] border border-[#232C42] rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400">تاريخ بدء الوردية: </span>
              <span className="text-slate-200 font-medium">
                {formatDateTime(currentShift.startTime)}
              </span>
            </div>
            <Badge variant="purple" size="sm">
              {shiftInvoices.length} فواتير مسجلة
            </Badge>
          </div>

          {/* Revenue Breakdown Cards */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <p className="text-slate-400 text-[10px]">كاش الدرج</p>
              <p className="text-sm font-black text-emerald-400 font-mono-numbers mt-0.5">
                {formatCurrency(totalCashSales)}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-violet-950/20 border border-violet-500/30">
              <p className="text-slate-400 text-[10px]">فيزا / بطاقات</p>
              <p className="text-sm font-black text-violet-400 font-mono-numbers mt-0.5">
                {formatCurrency(totalCardSales)}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
              <p className="text-slate-400 text-[10px]">محافظ إلكترونية</p>
              <p className="text-sm font-black text-cyan-400 font-mono-numbers mt-0.5">
                {formatCurrency(totalWalletSales)}
              </p>
            </div>
          </div>

          {/* Reconciliation Math Box */}
          <div className="p-4 bg-[#0F131D] border border-[#232C42] rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>عهدة نقدية بداية الوردية (الافتتاحي):</span>
              <span className="font-bold font-mono-numbers">{formatCurrency(startingCash)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>+ إجمالي المبيعات النقدية (الكاش):</span>
              <span className="font-bold font-mono-numbers text-emerald-400">+{formatCurrency(totalCashSales)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>- مصروفات ونثريات الوردية (مسحوبات):</span>
              <span className="font-bold font-mono-numbers text-rose-400">-{formatCurrency(totalExpensesAmount)}</span>
            </div>
            <div className="pt-2 border-t border-[#1F273E] flex justify-between text-sm font-bold text-white">
              <span>الكاش المتوقع وجوده بالدرج:</span>
              <span className="text-base text-amber-400 font-mono-numbers">
                {formatCurrency(expectedCashInDrawer)}
              </span>
            </div>
          </div>

          {/* Actual Cash Input */}
          <div className="space-y-1.5">
            <Input
              label="المبلغ النقدي الفعلي الموجود بالدرج حالياً (ج.م):"
              type="number"
              min="0"
              required
              placeholder="قم بعد النقدية الموجودة في الدرج واكتب المبلغ هنا..."
              value={countedCash}
              onChange={(e) => setCountedCash(e.target.value)}
            />

            {/* Discrepancy feedback alert */}
            {countedCash !== '' && (
              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  discrepancy === 0
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : discrepancy > 0
                    ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                }`}
              >
                <span>
                  {discrepancy === 0
                    ? '✓ الدرج مطابق تماماً للحسابات بدون أي عجز'
                    : discrepancy > 0
                    ? '▲ يوجد فائض / زيادة نقدية بالدرج:'
                    : '▼ يوجد عجز نقدي بالدرج:'}
                </span>
                <span className="text-sm font-mono-numbers">
                  {discrepancy > 0 ? '+' : ''}
                  {formatCurrency(discrepancy)}
                </span>
              </div>
            )}
          </div>

          {/* Shift Handover Notes */}
          <Input
            label="ملاحظات تسليم الوردية (اختياري):"
            placeholder="أي تفاصيل خاصة بالوردية أو تسليم الشيفت القادم..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              type="submit"
              variant="danger"
              fullWidth
              size="lg"
              icon={Power}
              disabled={countedCash === ''}
              className="font-bold text-sm"
            >
              اعتماد وتقفيل الوردية نهائياً
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleFinishAndExit}
            >
              إلغاء
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

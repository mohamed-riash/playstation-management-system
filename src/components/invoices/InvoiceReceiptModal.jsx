import React from 'react';
import { Printer, QrCode } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDateTime } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../utils/constants';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export function InvoiceReceiptModal() {
  const { activeReceiptModal, setActiveReceiptModal, settings } = useApp();

  if (!activeReceiptModal) return null;

  const invoice = activeReceiptModal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={Boolean(activeReceiptModal)}
      onClose={() => setActiveReceiptModal(null)}
      title="معاينة فاتورة العميل"
      subtitle={`رقم الفاتورة: ${invoice.id}`}
      maxWidth="max-w-sm"
    >
      <div className="space-y-4">
        {/* Printable Thermal Receipt Box */}
        <div
          id="thermal-receipt"
          className="p-5 bg-white text-black rounded-xl font-mono text-xs shadow-inner space-y-3 select-text"
          dir="rtl"
        >
          {/* Header */}
          <div className="text-center border-b border-dashed border-gray-400 pb-3 space-y-1">
            <h2 className="text-base font-black tracking-tight uppercase">
              {settings.loungeName}
            </h2>
            <p className="text-[11px] text-gray-700">{settings.loungeTagline}</p>
            <p className="text-[10px] text-gray-600">{settings.address}</p>
            <p className="text-[10px] text-gray-600">هاتف: {settings.phone}</p>
          </div>

          {/* Meta Info */}
          <div className="text-[11px] space-y-1 border-b border-dashed border-gray-400 pb-2">
            <div className="flex justify-between">
              <span className="text-gray-600">رقم الفاتورة:</span>
              <span className="font-bold">{invoice.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">التاريخ والوقت:</span>
              <span>{formatDateTime(invoice.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الكاشير:</span>
              <span>{invoice.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">العميل:</span>
              <span className="font-bold">{invoice.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الجهاز / القسم:</span>
              <span className="font-bold">{invoice.deviceName}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-1.5 border-b border-dashed border-gray-400 pb-2">
            <div className="flex justify-between font-bold text-[11px] pb-1 border-b border-gray-200">
              <span>الصنف</span>
              <span>الكمية x السعر</span>
              <span>الإجمالي</span>
            </div>
            {(invoice.items || []).map((item, idx) => (
              <div key={idx} className="flex justify-between text-[11px]">
                <span className="truncate max-w-[140px]">{item.name}</span>
                <span className="text-gray-600 font-mono-numbers">
                  {item.qty} x {item.price}
                </span>
                <span className="font-bold font-mono-numbers">
                  {(item.qty * item.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-gray-400 pb-2">
            {invoice.deviceCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">حساب الوقت:</span>
                <span>{invoice.deviceCost.toFixed(2)} ج.م</span>
              </div>
            )}
            {invoice.cafeCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">حساب الكافيه:</span>
                <span>{invoice.cafeCost.toFixed(2)} ج.م</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>الخصم:</span>
                <span>-{invoice.discount.toFixed(2)} ج.م</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black pt-1 border-t border-gray-300">
              <span>الإجمالي المطلوب:</span>
              <span className="text-base">{invoice.total.toFixed(2)} ج.م</span>
            </div>
            <div className="flex justify-between text-gray-700 pt-1">
              <span>طريقة الدفع:</span>
              <span>{PAYMENT_METHODS[invoice.paymentMethod]?.label || invoice.paymentMethod}</span>
            </div>
            {invoice.paidAmount > 0 && (
              <>
                <div className="flex justify-between text-gray-700">
                  <span>المدفوع:</span>
                  <span>{invoice.paidAmount.toFixed(2)} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>الباقي:</span>
                  <span>{invoice.changeDue.toFixed(2)} ج.م</span>
                </div>
              </>
            )}
          </div>

          {/* Footer Note & Barcode Mock */}
          <div className="text-center pt-2 space-y-2">
            <p className="text-[10px] text-gray-700 font-sans">
              {settings.receiptFooterNote}
            </p>
            <div className="flex justify-center py-1">
              <div className="w-16 h-16 border-2 border-black flex items-center justify-center">
                <QrCode className="w-12 h-12 text-black" />
              </div>
            </div>
            <p className="text-[9px] text-gray-500 font-mono tracking-widest">
              * {invoice.id} *
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1 no-print">
          <Button
            type="button"
            variant="primary"
            fullWidth
            size="md"
            icon={Printer}
            onClick={handlePrint}
            className="font-bold"
          >
            طباعة الفاتورة (80mm)
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => setActiveReceiptModal(null)}
          >
            تم
          </Button>
        </div>
      </div>
    </Modal>
  );
}

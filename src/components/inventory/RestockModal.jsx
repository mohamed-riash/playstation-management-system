import React, { useState } from 'react';
import { PackageCheck, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export function RestockModal({ item, isOpen, onClose }) {
  const { restockItem } = useApp();

  const [addedQty, setAddedQty] = useState('');
  const [newCost, setNewCost] = useState('');

  if (!item) return null;

  const handleRestock = (e) => {
    e.preventDefault();
    if (!addedQty || Number(addedQty) <= 0) return;

    restockItem(item.id, addedQty, newCost !== '' ? newCost : undefined);
    setAddedQty('');
    setNewCost('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`توريد كمية جديدة: ${item.name}`}
      subtitle={`الرصيد الحالي بالمخزن: ${item.stock} قطعة`}
      maxWidth="max-w-sm"
    >
      <form onSubmit={handleRestock} className="space-y-4">
        <div className="p-3 rounded-xl bg-[#0E121C] border border-[#232C42] text-xs space-y-1">
          <div className="flex justify-between text-slate-300">
            <span>سعر البيع الحالي:</span>
            <span className="font-bold text-white font-mono-numbers">{formatCurrency(item.price)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>تكلفة الشراء السابقة:</span>
            <span className="font-bold text-slate-400 font-mono-numbers">{formatCurrency(item.cost)}</span>
          </div>
        </div>

        <Input
          label="الكمية الموردة الجديدة:"
          type="number"
          min="1"
          required
          placeholder="مثال: 24، 50..."
          value={addedQty}
          onChange={(e) => setAddedQty(e.target.value)}
        />

        <Input
          label="سعر التكلفة الجديد للقطعة (اختياري إذا تغير):"
          type="number"
          min="0"
          placeholder={String(item.cost)}
          value={newCost}
          onChange={(e) => setNewCost(e.target.value)}
          helperText="اتركه فارغاً للاحتفاظ بنفس التكلفة السابقة"
        />

        <div className="flex items-center gap-2 pt-2">
          <Button
            type="submit"
            variant="success"
            fullWidth
            size="md"
            icon={PackageCheck}
          >
            تأكيد التوريد وزيادة المخزون
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
      </form>
    </Modal>
  );
}

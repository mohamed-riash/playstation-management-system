import React, { useState } from 'react';
import { Coins, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Input';

export function AddExpenseModal({ isOpen, onClose }) {
  const { addExpense } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('supplies');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const categories = [
    { value: 'supplies', label: 'خامات ومستلزمات كافيه (شاي، بن، سكر)' },
    { value: 'maintenance', label: 'صيانة وإصلاح أجهزة وذراعات' },
    { value: 'bills', label: 'فواتير (كهرباء، إنترنت، مياه)' },
    { value: 'salaries', label: 'سلف ورواتب عمال وكباتن' },
    { value: 'general', label: 'مصروفات ونثريات عامة' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    addExpense({
      title: title.trim(),
      category,
      amount: Number(amount),
      notes: notes.trim(),
    });

    setTitle('');
    setAmount('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تسجيل مصروف / سحب نثريات جديد"
      subtitle="سيتم خصم هذا المبلغ تلقائياً من درج النقدية في تقفيل الوردية"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="بيان المصروف:"
          required
          placeholder="مثال: فاتورة كهرباء، شراء بن وسكر، صيانة ذراع PS5..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Select
          label="التصنيف:"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categories}
        />

        <Input
          label="المبلغ المسحوب (ج.م):"
          type="number"
          min="1"
          required
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Input
          label="ملاحظات إضافية أو رقم الفاتورة (اختياري):"
          placeholder="مثال: تم الصرف بمعرفة المدير..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center gap-2 pt-2">
          <Button
            type="submit"
            variant="danger"
            fullWidth
            size="lg"
            icon={Coins}
          >
            تسجيل وخصم من الدرج
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

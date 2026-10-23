import React, { useState } from 'react';
import { PackagePlus, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MENU_CATEGORIES } from '../../utils/constants';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Input';

export function AddStockModal({ isOpen, onClose }) {
  const { addInventoryItem } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('hot_drinks');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('10');

  const categoryOptions = MENU_CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addInventoryItem({
      name: name.trim(),
      category,
      price: Number(price) || 0,
      cost: Number(cost) || 0,
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 10,
    });

    setName('');
    setPrice('');
    setCost('');
    setStock('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="إضافة صنف جديد للمخزن والكافيه"
      subtitle="سجل بيانات المنتج وأسعار الشراء والبيع والكمية الأولية"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="اسم المنتج / المشروب:"
          required
          placeholder="مثال: نسكافيه بلاك، كانز بيبسي، شيبسي..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Select
          label="التصنيف:"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="سعر البيع للزبون (ج.م):"
            type="number"
            min="0"
            required
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <Input
            label="تكلفة الشراء (ج.م):"
            type="number"
            min="0"
            required
            placeholder="0.00"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="الكمية المتاحة حالياً بالمخزن:"
            type="number"
            min="0"
            required
            placeholder="مثال: 50"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <Input
            label="حد التنبيه بالنقص:"
            type="number"
            min="1"
            required
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            type="submit"
            variant="success"
            fullWidth
            size="lg"
            icon={Plus}
          >
            حفظ وإضافة للمخزن
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

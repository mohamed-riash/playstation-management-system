import React, { useState } from 'react';
import { Gamepad2, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEVICE_TYPES } from '../../utils/constants';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Input';

export function AddDeviceModal({ isOpen, onClose }) {
  const { addDevice } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState('ps5');
  const [screenSize, setScreenSize] = useState('شاشة 55 بوصة 4K 120Hz');
  const [singleRate, setSingleRate] = useState('45');
  const [multiRate, setMultiRate] = useState('65');
  const [vipRate, setVipRate] = useState('90');

  const typeOptions = Object.entries(DEVICE_TYPES).map(([key, info]) => ({
    value: key,
    label: info.label,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addDevice({
      name: name.trim(),
      type,
      screenSize: screenSize.trim(),
      rates: {
        single: Number(singleRate) || 40,
        multi: Number(multiRate) || 60,
        vip: Number(vipRate) || 90,
      },
    });

    setName('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="إضافة جهاز جديد للصالة"
      subtitle="حدد نوع الجهاز ومواصفات الشاشة وأسعار الساعة الفردي والزوجي"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="اسم الجهاز:"
          required
          placeholder="مثال: PS5 - جهاز 6، غرفة VIP 2، طاولة بلياردو 2..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Select
          label="نوع الجهاز / القسم:"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={typeOptions}
        />

        <Input
          label="مواصفات الشاشة أو الطاولة:"
          placeholder="مثال: شاشة 55 بوصة OLED 120Hz..."
          value={screenSize}
          onChange={(e) => setScreenSize(e.target.value)}
        />

        <div className="grid grid-cols-3 gap-2">
          <Input
            label="سعر الفردي (ج.م/س):"
            type="number"
            min="0"
            required
            value={singleRate}
            onChange={(e) => setSingleRate(e.target.value)}
          />
          <Input
            label="سعر الزوجي (ج.م/س):"
            type="number"
            min="0"
            required
            value={multiRate}
            onChange={(e) => setMultiRate(e.target.value)}
          />
          <Input
            label="سعر VIP (ج.م/س):"
            type="number"
            min="0"
            required
            value={vipRate}
            onChange={(e) => setVipRate(e.target.value)}
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
            إضافة الجهاز للصالة
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

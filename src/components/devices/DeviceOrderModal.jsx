import React, { useState } from 'react';
import {
  Coffee,
  Plus,
  Minus,
  Search,
  Check,
  ShoppingBag,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MENU_CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';

export function DeviceOrderModal({ device, isOpen, onClose }) {
  const { inventory, addOrderToDevice } = useApp();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState({}); // { itemId: qty }

  if (!device || !device.activeSession) return null;

  const existingOrders = device.activeSession.orders || [];

  // Filter inventory
  const filteredProducts = inventory.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleIncrement = (itemId) => {
    const item = inventory.find((i) => i.id === itemId);
    if (!item) return;

    const currentQty = selectedItems[itemId] || 0;
    if (currentQty >= item.stock) return; // cannot exceed available stock

    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: currentQty + 1,
    }));
  };

  const handleDecrement = (itemId) => {
    const currentQty = selectedItems[itemId] || 0;
    if (currentQty <= 1) {
      const next = { ...selectedItems };
      delete next[itemId];
      setSelectedItems(next);
    } else {
      setSelectedItems((prev) => ({
        ...prev,
        [itemId]: currentQty - 1,
      }));
    }
  };

  // Calculate total of new items
  const newItemsList = Object.entries(selectedItems).map(([id, qty]) => {
    const product = inventory.find((p) => p.id === id);
    return {
      id,
      name: product?.name || '',
      price: product?.price || 0,
      qty,
      category: product?.category || 'general',
    };
  });

  const newTotal = newItemsList.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSaveOrder = () => {
    if (newItemsList.length === 0) return;
    addOrderToDevice(device.id, newItemsList);
    setSelectedItems({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`إضافة طلب كافيه: ${device.name}`}
      subtitle={`العميل: ${device.activeSession.customerName}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Previously ordered items on this session */}
        {existingOrders.length > 0 && (
          <div className="p-3 bg-[#0E121C] border border-[#232C42] rounded-xl">
            <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              الطلبات المضافة مسبقاً للجلسة:
            </p>
            <div className="flex flex-wrap gap-2">
              {existingOrders.map((ord, idx) => (
                <div
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#181E2F] border border-[#232C42] text-slate-200 flex items-center gap-2"
                >
                  <span className="font-bold text-amber-400">{ord.qty}x</span>
                  <span>{ord.name}</span>
                  <span className="text-slate-400 font-mono-numbers">
                    ({formatCurrency(ord.price * ord.qty)})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Categories Bar */}
        <div className="space-y-2">
          <Input
            placeholder="ابحث عن مشروب، سناك، أو وجبة..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer
                  ${
                    activeCategory === cat.id
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-[#0F131D] text-slate-400 hover:text-white border border-[#232C42]'
                  }
                `}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="max-h-60 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredProducts.map((prod) => {
            const isOutOfStock = prod.stock <= 0;
            const currentSelected = selectedItems[prod.id] || 0;

            return (
              <div
                key={prod.id}
                className={`
                  p-2.5 rounded-xl border flex items-center justify-between text-right transition-all
                  ${
                    currentSelected > 0
                      ? 'bg-violet-950/20 border-violet-500/50'
                      : 'bg-[#0F131D] border-[#232C42] hover:border-slate-700'
                  }
                  ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}
                `}
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">{prod.name}</h4>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-emerald-400 font-bold font-mono-numbers">
                      {formatCurrency(prod.price)}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className={`text-[10px] ${prod.stock <= prod.minStock ? 'text-rose-400' : 'text-slate-400'}`}>
                      المتوفر: {prod.stock}
                    </span>
                  </div>
                </div>

                {/* Counter controls */}
                <div className="flex items-center gap-1 bg-[#181E2F] p-1 rounded-lg border border-[#232C42]">
                  {currentSelected > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDecrement(prod.id)}
                        className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white font-mono-numbers">
                        {currentSelected}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncrement(prod.id)}
                        disabled={currentSelected >= prod.stock}
                        className="w-6 h-6 rounded bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleIncrement(prod.id)}
                      disabled={isOutOfStock}
                      className="px-2.5 py-1 rounded bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>إضافة</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Items summary bar */}
        <div className="p-3 bg-violet-950/20 border border-violet-500/25 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold">إجمالي الطلبات الجديدة:</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300 font-bold font-mono-numbers">
              {newItemsList.reduce((sum, i) => sum + i.qty, 0)} أصناف
            </span>
          </div>
          <span className="text-base font-black text-emerald-400 font-mono-numbers">
            {formatCurrency(newTotal)}
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            type="button"
            variant="success"
            fullWidth
            size="md"
            icon={Check}
            disabled={newItemsList.length === 0}
            onClick={handleSaveOrder}
          >
            تأكيد وإضافة الطلبات للجلسة
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            إغلاق
          </Button>
        </div>
      </div>
    </Modal>
  );
}

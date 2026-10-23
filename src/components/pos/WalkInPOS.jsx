import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MENU_CATEGORIES, PAYMENT_METHODS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export function WalkInPOS() {
  const { inventory, createWalkInOrder } = useApp();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]); // [{ id, name, price, qty, stock }]
  const [customerName, setCustomerName] = useState('عميل كافيه كاش');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('');

  // Filter products
  const filteredProducts = inventory.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (product) => {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          stock: product.stock,
        },
      ];
    });
  };

  const handleUpdateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.qty + delta;
            if (newQty <= 0) return null;
            if (newQty > item.stock) return item;
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    setDiscount(0);
    setPaidAmount('');
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const effectiveDiscount = Math.min(subtotal, Math.max(0, Number(discount) || 0));
  const finalTotal = Math.max(0, subtotal - effectiveDiscount);

  const numericPaid = paidAmount === '' ? finalTotal : Number(paidAmount);
  const changeDue = Math.max(0, numericPaid - finalTotal);

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    createWalkInOrder(cart, {
      customerName: customerName.trim() || 'عميل كافيه',
      cafeCost: subtotal,
      discount: effectiveDiscount,
      total: finalTotal,
      paymentMethod,
      paidAmount: numericPaid,
      changeDue,
      notes,
    });

    handleClearCart();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Products Catalog Area (8 cols on desktop) */}
      <div className="lg:col-span-8 space-y-4">
        {/* Search & Categories */}
        <div className="p-4 bg-[#131722] border border-[#232C42] rounded-2xl space-y-3">
          <Input
            placeholder="ابحث عن مشروب، قهوة، شيبسي، وجبة سريعة..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  px-3.5 py-2 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer
                  ${
                    activeCategory === cat.id
                      ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30'
                      : 'bg-[#0F131D] text-slate-400 hover:text-white border border-[#232C42]'
                  }
                `}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredProducts.map((prod) => {
            const isOutOfStock = prod.stock <= 0;
            const inCartItem = cart.find((c) => c.id === prod.id);

            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => handleAddToCart(prod)}
                disabled={isOutOfStock}
                className={`
                  p-3.5 rounded-2xl border text-right flex flex-col justify-between transition-all duration-150 cursor-pointer group relative overflow-hidden
                  ${
                    inCartItem
                      ? 'bg-violet-950/30 border-violet-500/50 shadow-sm'
                      : 'bg-[#131722] border-[#232C42] hover:border-violet-500/40 hover:bg-[#181E2F]'
                  }
                  ${isOutOfStock ? 'opacity-40 cursor-not-allowed hover:border-[#232C42]' : ''}
                `}
              >
                {inCartItem && (
                  <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center font-mono-numbers">
                    {inCartItem.qty}
                  </span>
                )}

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2">
                    {prod.name}
                  </h4>
                  <p
                    className={`text-[10px] ${
                      prod.stock <= prod.minStock ? 'text-rose-400 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {isOutOfStock ? 'نفذ من المخزن' : `متاح: ${prod.stock}`}
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-between w-full">
                  <span className="text-sm font-black text-emerald-400 font-mono-numbers">
                    {formatCurrency(prod.price)}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-slate-800 group-hover:bg-violet-600 group-hover:text-white text-slate-300 flex items-center justify-center transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cart & Checkout Terminal (4 cols on desktop) */}
      <div className="lg:col-span-4">
        <form
          onSubmit={handleCompleteOrder}
          className="bg-[#131722] border border-[#232C42] rounded-2xl p-5 space-y-4 sticky top-24 shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#232C42] pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-bold text-white">سلة الطلب الخارجي</h3>
            </div>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={handleClearCart}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>إفراغ السلة</span>
              </button>
            )}
          </div>

          {/* Customer Name */}
          <Input
            label="اسم العميل:"
            placeholder="مثال: أحمد، طاولة خارجية..."
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          {/* Cart Items List */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="py-8 text-center text-slate-500 space-y-1">
                <ShoppingBag className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
                <p className="text-xs">السلة فارغة، اختر أصنافاً من القائمة</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F131D] border border-[#232C42] text-xs"
                >
                  <div className="text-right">
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono-numbers">
                      {formatCurrency(item.price)} للواحدة
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-[#181E2F] p-1 rounded-lg border border-[#232C42]">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-5 text-center font-bold text-white font-mono-numbers">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, 1)}
                        disabled={item.qty >= item.stock}
                        className="w-5 h-5 rounded bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <span className="w-16 text-left font-black text-emerald-400 font-mono-numbers">
                      {formatCurrency(item.price * item.qty)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Subtotal & Discount */}
          <div className="space-y-2 pt-2 border-t border-[#232C42]">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>المجموع الفرعي:</span>
              <span className="font-bold text-white font-mono-numbers">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <Input
              label="الخصم (ج.م):"
              type="number"
              min="0"
              max={subtotal}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>

          {/* Payment Method Pills */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-slate-300">طريقة الدفع:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.entries(PAYMENT_METHODS).map(([key]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPaymentMethod(key)}
                  className={`
                    p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer
                    ${
                      paymentMethod === key
                        ? 'bg-violet-600/30 border-violet-500 text-white'
                        : 'bg-[#0F131D] border-[#232C42] text-slate-400 hover:border-slate-600'
                    }
                  `}
                >
                  <span>{key === 'cash' ? 'نقدي' : key === 'card' ? 'فيزا' : 'محفظة'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cash calculator helper */}
          {paymentMethod === 'cash' && cart.length > 0 && (
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#0F131D] border border-[#232C42] rounded-xl text-xs">
              <Input
                label="المستلم:"
                type="number"
                placeholder={String(finalTotal)}
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
              />
              <div className="flex flex-col justify-center text-right">
                <span className="text-slate-400 text-[11px]">الباقي:</span>
                <span className="text-base font-black text-emerald-400 font-mono-numbers">
                  {formatCurrency(changeDue)}
                </span>
              </div>
            </div>
          )}

          {/* Total & Checkout Button */}
          <div className="p-3 bg-[#0E121C] border border-violet-500/30 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">الإجمالي النهائي:</span>
            <span className="text-xl font-black text-emerald-400 font-mono-numbers">
              {formatCurrency(finalTotal)}
            </span>
          </div>

          <Button
            type="submit"
            variant="success"
            fullWidth
            size="lg"
            disabled={cart.length === 0}
            icon={CheckCircle2}
            className="font-bold text-sm"
          >
            تأكيد الطلب وطباعة الفاتورة ({formatCurrency(finalTotal)})
          </Button>
        </form>
      </div>
    </div>
  );
}

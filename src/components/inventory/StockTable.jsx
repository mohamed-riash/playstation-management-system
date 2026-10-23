import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  PackageCheck,
  AlertTriangle,
  Trash2,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MENU_CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { Table } from '../common/Table';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { StatCard } from '../common/StatCard';
import { AddStockModal } from './AddStockModal';
import { RestockModal } from './RestockModal';

export function StockTable() {
  const { inventory, deleteInventoryItem } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [restockModalItem, setRestockModalItem] = useState(null);

  // Filter items
  const filteredItems = inventory.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // KPI calculations
  const totalItemsCount = inventory.length;
  const lowStockCount = inventory.filter((i) => i.stock <= i.minStock).length;
  const totalCostValue = inventory.reduce((sum, i) => sum + i.cost * i.stock, 0);
  const totalRetailValue = inventory.reduce((sum, i) => sum + i.price * i.stock, 0);
  const potentialProfit = totalRetailValue - totalCostValue;

  return (
    <div className="space-y-6">
      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي أصناف المخزن"
          value={`${totalItemsCount} صنف`}
          icon={Package}
          color="purple"
        />
        <StatCard
          title="أصناف منخفضة المخزون"
          value={`${lowStockCount} صنف`}
          subtitle="تحتاج لتوريد كميات إضافية"
          icon={AlertTriangle}
          color={lowStockCount > 0 ? 'red' : 'green'}
        />
        <StatCard
          title="إجمالي تكلفة المخزون"
          value={formatCurrency(totalCostValue)}
          subtitle="رأس المال الموجود بالبضاعة"
          icon={DollarSign}
          color="cyan"
        />
        <StatCard
          title="الأرباح المتوقعة عند البيع"
          value={formatCurrency(potentialProfit)}
          subtitle={`قيمة البيع: ${formatCurrency(totalRetailValue)}`}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Action Bar & Filters */}
      <div className="p-4 bg-[#131722] border border-[#232C42] rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="ابحث عن منتج بالاسم..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-[#0F131D] p-1 rounded-xl border border-[#232C42] text-xs overflow-x-auto">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <Button
            variant="success"
            size="md"
            icon={Plus}
            onClick={() => setAddModalOpen(true)}
          >
            إضافة صنف جديد
          </Button>
        </div>
      </div>

      {/* Stock Table */}
      <Table
        headers={[
          'اسم المنتج',
          'التصنيف',
          'سعر البيع',
          'تكلفة الشراء',
          'هامش الربح',
          'الكمية المتوفرة',
          'حد التنبيه',
          'حالة المخزون',
          'إجراءات',
        ]}
        isEmpty={filteredItems.length === 0}
        emptyMessage="لا توجد أصناف مطابقة للبحث في المخزن"
      >
        {filteredItems.map((item) => {
          const profit = item.price - item.cost;
          const marginPercent = item.cost > 0 ? Math.round((profit / item.cost) * 100) : 100;
          const isLow = item.stock <= item.minStock && item.stock > 0;
          const isOut = item.stock <= 0;

          return (
            <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
              <td className="px-4 py-3 font-bold text-white">
                {item.name}
              </td>
              <td className="px-4 py-3 text-xs text-slate-400">
                {MENU_CATEGORIES.find((c) => c.id === item.category)?.name || item.category}
              </td>
              <td className="px-4 py-3 font-bold text-emerald-400 font-mono-numbers">
                {formatCurrency(item.price)}
              </td>
              <td className="px-4 py-3 text-slate-400 font-mono-numbers">
                {formatCurrency(item.cost)}
              </td>
              <td className="px-4 py-3 text-xs font-semibold text-cyan-400 font-mono-numbers">
                +{formatCurrency(profit)} ({marginPercent}%)
              </td>
              <td className="px-4 py-3 font-bold font-mono-numbers text-sm text-white">
                {item.stock} قطعة
              </td>
              <td className="px-4 py-3 text-xs text-slate-400 font-mono-numbers">
                {item.minStock}
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={isOut ? 'danger' : isLow ? 'warning' : 'success'}
                  dot
                  size="sm"
                >
                  {isOut ? 'نفذت الكمية' : isLow ? 'منخفض المخزون' : 'متوفر بالمخزن'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="cyan"
                    size="sm"
                    icon={PackageCheck}
                    onClick={() => setRestockModalItem(item)}
                    title="توريد كمية جديدة"
                  >
                    توريد
                  </Button>
                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف الصنف "${item.name}" نهائياً من المخزن؟`)) {
                        deleteInventoryItem(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-600/30 transition-colors cursor-pointer"
                    title="حذف الصنف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </Table>

      {/* Add Stock Modal */}
      {addModalOpen && (
        <AddStockModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
        />
      )}

      {/* Restock Modal */}
      {restockModalItem && (
        <RestockModal
          item={restockModalItem}
          isOpen={Boolean(restockModalItem)}
          onClose={() => setRestockModalItem(null)}
        />
      )}
    </div>
  );
}

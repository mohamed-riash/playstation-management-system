import React, { useState } from 'react';
import {
  Coins,
  Search,
  Plus,
  Trash2,
  Calendar,
  Layers,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Table } from '../common/Table';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { StatCard } from '../common/StatCard';
import { AddExpenseModal } from './AddExpenseModal';

export function ExpensesView() {
  const { expenses, deleteExpense } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const categoryLabels = {
    supplies: { label: 'خامات ومستلزمات كافيه', variant: 'warning' },
    maintenance: { label: 'صيانة وإصلاح أجهزة', variant: 'purple' },
    bills: { label: 'فواتير ومرافق', variant: 'info' },
    salaries: { label: 'رواتب وسلف', variant: 'cyan' },
    general: { label: 'مصروفات عامة', variant: 'default' },
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchesCat = activeCategory === 'all' || exp.category === activeCategory;
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.notes && exp.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const totalExpensesAmount = filteredExpenses.reduce(
    (sum, e) => sum + (Number(e.amount) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="إجمالي المصروفات المسجلة"
          value={formatCurrency(totalExpensesAmount)}
          subtitle={`${filteredExpenses.length} عملية صرف`}
          icon={Coins}
          color="red"
        />
        <StatCard
          title="مصروفات صيانة الأجهزة"
          value={formatCurrency(
            expenses
              .filter((e) => e.category === 'maintenance')
              .reduce((sum, e) => sum + e.amount, 0)
          )}
          subtitle="ذراعات وكابلات وشاشات"
          icon={Layers}
          color="purple"
        />
        <StatCard
          title="خامات ومشتريات الكافيه"
          value={formatCurrency(
            expenses
              .filter((e) => e.category === 'supplies')
              .reduce((sum, e) => sum + e.amount, 0)
          )}
          subtitle="بن وشاي وسكر ومواد خام"
          icon={DollarSign}
          color="amber"
        />
      </div>

      {/* Filter and Add Action */}
      <div className="p-4 bg-[#131722] border border-[#232C42] rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="ابحث في المصروفات..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-[#0F131D] p-1 rounded-xl border border-[#232C42] text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                activeCategory === 'all' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            {Object.entries(categoryLabels).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                  activeCategory === key ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {info.label}
              </button>
            ))}
          </div>

          <Button
            variant="danger"
            size="md"
            icon={Plus}
            onClick={() => setAddModalOpen(true)}
          >
            تسجيل مصروف جديد
          </Button>
        </div>
      </div>

      {/* Expenses Table */}
      <Table
        headers={[
          'التاريخ والوقت',
          'بيان المصروف',
          'التصنيف',
          'المبلغ المسحوب',
          'تم الصرف بواسطة',
          'ملاحظات',
          'إجراءات',
        ]}
        isEmpty={filteredExpenses.length === 0}
        emptyMessage="لا توجد مصروفات مسجلة مطابقة للبحث"
      >
        {filteredExpenses.map((exp) => (
          <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
            <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap font-mono-numbers">
              {formatDateTime(exp.date)}
            </td>
            <td className="px-4 py-3 font-bold text-white">
              {exp.title}
            </td>
            <td className="px-4 py-3">
              <Badge
                variant={categoryLabels[exp.category]?.variant || 'default'}
                size="sm"
              >
                {categoryLabels[exp.category]?.label || exp.category}
              </Badge>
            </td>
            <td className="px-4 py-3 font-black text-rose-400 font-mono-numbers text-sm">
              -{formatCurrency(exp.amount)}
            </td>
            <td className="px-4 py-3 text-xs text-slate-300">
              {exp.paidBy || 'الكاشير'}
            </td>
            <td className="px-4 py-3 text-xs text-slate-400">
              {exp.notes || '-'}
            </td>
            <td className="px-4 py-3">
              <button
                onClick={() => {
                  if (confirm(`هل أنت متأكد من حذف المصروف "${exp.title}"؟`)) {
                    deleteExpense(exp.id);
                  }
                }}
                className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-600/30 transition-colors cursor-pointer"
                title="حذف المصروف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </Table>

      {/* Add Expense Modal */}
      {addModalOpen && (
        <AddExpenseModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
        />
      )}
    </div>
  );
}

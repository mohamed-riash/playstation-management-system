import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Printer,
  Calendar,
  Filter,
  CreditCard,
  Banknote,
  Smartphone,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../utils/constants';
import { Table } from '../common/Table';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export function InvoicesTable() {
  const { invoices, setActiveReceiptModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterType, setFilterType] = useState('all'); // all, device_session, walkin_cafe

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.customerName && inv.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.deviceName && inv.deviceName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMethod = filterMethod === 'all' || inv.paymentMethod === filterMethod;
    const matchesType = filterType === 'all' || inv.type === filterType;

    return matchesSearch && matchesMethod && matchesType;
  });

  const totalRevenue = filteredInvoices.reduce((sum, i) => sum + (Number(i.total) || 0), 0);

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="p-4 bg-[#131722] border border-[#232C42] rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="ابحث برقم الفاتورة، اسم العميل، أو الجهاز..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter by Method */}
          <div className="flex items-center gap-1 bg-[#0F131D] p-1 rounded-xl border border-[#232C42] text-xs">
            <button
              onClick={() => setFilterMethod('all')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                filterMethod === 'all' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              كل طرق الدفع
            </button>
            <button
              onClick={() => setFilterMethod('cash')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                filterMethod === 'cash' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              كاش
            </button>
            <button
              onClick={() => setFilterMethod('card')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                filterMethod === 'card' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              فيزا
            </button>
            <button
              onClick={() => setFilterMethod('wallet')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                filterMethod === 'wallet' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              محفظة
            </button>
          </div>

          {/* Filter by Type */}
          <div className="flex items-center gap-1 bg-[#0F131D] p-1 rounded-xl border border-[#232C42] text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                filterType === 'all' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterType('device_session')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                filterType === 'device_session' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              أجهزة
            </button>
            <button
              onClick={() => setFilterType('walkin_cafe')}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                filterType === 'walkin_cafe' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              كافيه
            </button>
          </div>
        </div>
      </div>

      {/* Summary Tag */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          تم العثور على <strong className="text-white font-mono-numbers">{filteredInvoices.length}</strong> فاتورة
        </span>
        <span>
          إجمالي مبيعات الفواتير المعروضة:{' '}
          <strong className="text-emerald-400 font-mono-numbers text-sm">
            {formatCurrency(totalRevenue)}
          </strong>
        </span>
      </div>

      {/* Invoices Table */}
      <Table
        headers={[
          'رقم الفاتورة',
          'التاريخ والوقت',
          'النوع / الجهاز',
          'العميل',
          'حساب الجهاز',
          'حساب الكافيه',
          'الإجمالي النهائي',
          'طريقة الدفع',
          'الكاشير',
          'إجراءات',
        ]}
        isEmpty={filteredInvoices.length === 0}
        emptyMessage="لا توجد فواتير مسجلة مطابقة للبحث"
      >
        {filteredInvoices.map((inv) => (
          <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
            <td className="px-4 py-3 font-bold font-mono text-violet-400">
              {inv.id}
            </td>
            <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
              {formatDateTime(inv.date)}
            </td>
            <td className="px-4 py-3 font-semibold text-white">
              {inv.deviceName}
            </td>
            <td className="px-4 py-3 text-slate-300">
              {inv.customerName || 'عميل كاش'}
            </td>
            <td className="px-4 py-3 font-mono-numbers text-slate-300">
              {inv.deviceCost > 0 ? formatCurrency(inv.deviceCost) : '-'}
            </td>
            <td className="px-4 py-3 font-mono-numbers text-slate-300">
              {inv.cafeCost > 0 ? formatCurrency(inv.cafeCost) : '-'}
            </td>
            <td className="px-4 py-3 font-black text-emerald-400 font-mono-numbers text-sm">
              {formatCurrency(inv.total)}
            </td>
            <td className="px-4 py-3">
              <Badge
                variant={
                  inv.paymentMethod === 'cash'
                    ? 'success'
                    : inv.paymentMethod === 'card'
                    ? 'purple'
                    : 'info'
                }
                size="sm"
              >
                {PAYMENT_METHODS[inv.paymentMethod]?.label || inv.paymentMethod}
              </Badge>
            </td>
            <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
              {inv.cashierName}
            </td>
            <td className="px-4 py-3">
              <Button
                variant="outline"
                size="sm"
                icon={Printer}
                onClick={() => setActiveReceiptModal(inv)}
              >
                طباعة
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

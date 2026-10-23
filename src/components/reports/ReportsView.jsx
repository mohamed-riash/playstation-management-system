import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Gamepad2,
  Coffee,
  Coins,
  CreditCard,
  Banknote,
  Smartphone,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { DEVICE_TYPES } from '../../utils/constants';
import { StatCard } from '../common/StatCard';
import { Table } from '../common/Table';

export function ReportsView() {
  const { invoices, expenses, devices } = useApp();

  const [dateFilter, setDateFilter] = useState('all'); // all, today

  const filteredInvoices = invoices.filter((inv) => {
    if (dateFilter === 'today') {
      const invDate = new Date(inv.date).toDateString();
      const today = new Date().toDateString();
      return invDate === today;
    }
    return true;
  });

  const filteredExpenses = expenses.filter((exp) => {
    if (dateFilter === 'today') {
      const expDate = new Date(exp.date).toDateString();
      const today = new Date().toDateString();
      return expDate === today;
    }
    return true;
  });

  // Financial calculations
  const totalRevenue = filteredInvoices.reduce((sum, i) => sum + (Number(i.total) || 0), 0);
  const gamingRevenue = filteredInvoices.reduce((sum, i) => sum + (Number(i.deviceCost) || 0), 0);
  const cafeRevenue = filteredInvoices.reduce((sum, i) => sum + (Number(i.cafeCost) || 0), 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  // Payment methods breakdown
  const cashTotal = filteredInvoices
    .filter((i) => i.paymentMethod === 'cash')
    .reduce((sum, i) => sum + (Number(i.total) || 0), 0);
  const cardTotal = filteredInvoices
    .filter((i) => i.paymentMethod === 'card')
    .reduce((sum, i) => sum + (Number(i.total) || 0), 0);
  const walletTotal = filteredInvoices
    .filter((i) => i.paymentMethod === 'wallet')
    .reduce((sum, i) => sum + (Number(i.total) || 0), 0);

  // Device Breakdown calculation
  const deviceStats = {};
  Object.keys(DEVICE_TYPES).forEach((type) => {
    deviceStats[type] = { count: 0, revenue: 0, label: DEVICE_TYPES[type].label };
  });

  filteredInvoices.forEach((inv) => {
    if (inv.type === 'device_session') {
      const dev = devices.find((d) => d.id === inv.deviceId || d.name === inv.deviceName);
      const type = dev?.type || 'ps5';
      if (deviceStats[type]) {
        deviceStats[type].count += 1;
        deviceStats[type].revenue += Number(inv.deviceCost) || 0;
      }
    }
  });

  // Top selling cafe items
  const itemMap = {};
  filteredInvoices.forEach((inv) => {
    (inv.items || []).forEach((item) => {
      // skip gaming session item
      if (item.name.includes('جلسة')) return;
      if (!itemMap[item.name]) {
        itemMap[item.name] = { name: item.name, qty: 0, total: 0 };
      }
      itemMap[item.name].qty += item.qty;
      itemMap[item.name].total += item.qty * item.price;
    });
  });

  const topSellingItems = Object.values(itemMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Date Range Selector Bar */}
      <div className="flex items-center justify-between p-4 bg-[#131722] border border-[#232C42] rounded-2xl">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-violet-400" />
          <h3 className="text-sm font-bold text-white">الملخص المالي والتحليلي</h3>
        </div>

        <div className="flex items-center gap-1.5 bg-[#0F131D] p-1 rounded-xl border border-[#232C42] text-xs">
          <button
            onClick={() => setDateFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
              dateFilter === 'all' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            جميع العمليات المسجلة
          </button>
          <button
            onClick={() => setDateFilter('today')}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
              dateFilter === 'today' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            اليوم فقط
          </button>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="إجمالي الإيرادات"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          color="purple"
        />
        <StatCard
          title="إيرادات اللعب والأجهزة"
          value={formatCurrency(gamingRevenue)}
          subtitle={`${Math.round((gamingRevenue / (totalRevenue || 1)) * 100)}% من الدخل`}
          icon={Gamepad2}
          color="green"
        />
        <StatCard
          title="إيرادات الكافيه والطلبات"
          value={formatCurrency(cafeRevenue)}
          subtitle={`${Math.round((cafeRevenue / (totalRevenue || 1)) * 100)}% من الدخل`}
          icon={Coffee}
          color="amber"
        />
        <StatCard
          title="إجمالي المصروفات"
          value={formatCurrency(totalExpenses)}
          subtitle="صيانة وفواتير ومستلزمات"
          icon={Coins}
          color="red"
        />
        <StatCard
          title="صافي الربح الفعلي"
          value={formatCurrency(netProfit)}
          subtitle="بعد خصم المصروفات"
          icon={TrendingUp}
          color={netProfit >= 0 ? 'cyan' : 'red'}
        />
      </div>

      {/* Payment methods & Device Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Device Categories Revenue Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-[#131722] border border-[#232C42] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#232C42] pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              توزيع إيرادات أجهزة الصالة
            </h4>
            <span className="text-xs text-slate-400">إجمالي دخل الأجهزة</span>
          </div>

          <div className="space-y-4">
            {Object.entries(deviceStats).map(([typeKey, data]) => {
              const percent = gamingRevenue > 0 ? Math.round((data.revenue / gamingRevenue) * 100) : 0;
              return (
                <div key={typeKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{data.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono-numbers">
                        {formatCurrency(data.revenue)}
                      </span>
                      <span className="text-slate-400 text-[11px]">({percent}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#0F131D] h-2 rounded-full overflow-hidden border border-[#232C42]">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-[#131722] border border-[#232C42] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#232C42] pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-violet-400" />
              طرق التحصيل والدفع
            </h4>
            <span className="text-xs text-slate-400">نظرة عامة</span>
          </div>

          <div className="space-y-3">
            {/* Cash */}
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Banknote className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">كاش / نقدي الدرج</p>
                  <p className="text-[10px] text-slate-400">
                    {totalRevenue > 0 ? Math.round((cashTotal / totalRevenue) * 100) : 0}% من الإجمالي
                  </p>
                </div>
              </div>
              <span className="text-base font-black text-emerald-400 font-mono-numbers">
                {formatCurrency(cashTotal)}
              </span>
            </div>

            {/* Card */}
            <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="text-xs font-bold text-white">بطاقات بنكية / فيزا</p>
                  <p className="text-[10px] text-slate-400">
                    {totalRevenue > 0 ? Math.round((cardTotal / totalRevenue) * 100) : 0}% من الإجمالي
                  </p>
                </div>
              </div>
              <span className="text-base font-black text-violet-400 font-mono-numbers">
                {formatCurrency(cardTotal)}
              </span>
            </div>

            {/* Wallet */}
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-xs font-bold text-white">محافظ إلكترونية (إنستاباي / كاش)</p>
                  <p className="text-[10px] text-slate-400">
                    {totalRevenue > 0 ? Math.round((walletTotal / totalRevenue) * 100) : 0}% من الإجمالي
                  </p>
                </div>
              </div>
              <span className="text-base font-black text-cyan-400 font-mono-numbers">
                {formatCurrency(walletTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Items Table */}
      <div className="bg-[#131722] border border-[#232C42] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#232C42] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-bold text-white">الأصناف الأكثر طلباً ومبيعاً بالكافيه</h4>
          </div>
          <span className="text-xs text-slate-400">مرتبة حسب الأكثر طلباً</span>
        </div>

        <Table
          headers={['الترتيب', 'اسم الصنف', 'إجمالي الكمية المباعة', 'إجمالي الإيراد الناتج']}
          isEmpty={topSellingItems.length === 0}
          emptyMessage="لا توجد مبيعات مسجلة حتى الآن"
        >
          {topSellingItems.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
              <td className="px-4 py-3 font-bold text-amber-400 font-mono-numbers">
                #{idx + 1}
              </td>
              <td className="px-4 py-3 font-semibold text-white">
                {item.name}
              </td>
              <td className="px-4 py-3 font-bold font-mono-numbers text-sm text-slate-200">
                {item.qty} قطعة
              </td>
              <td className="px-4 py-3 font-black text-emerald-400 font-mono-numbers text-sm">
                {formatCurrency(item.total)}
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Menu, Clock, Gamepad2, ShoppingBag, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';

export function Header({ onToggleSidebar }) {
  const {
    activeTab,
    setActiveTab,
    activeDevicesCount,
    devices,
    todayRevenue,
    activeStaffMember,
  } = useApp();

  const { isMuted, toggleMute } = useAudio();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const titles = {
    devices: { title: 'إدارة الأجهزة والجلسات', sub: 'متابعة حية للوقت، حساب التكلفة، وطلبات الكافيه الفورية' },
    pos: { title: 'نقطة بيع الكافيه السريعة (POS)', sub: 'طلبات خارجية وسريعة مع خصم تلقائي من المخزن' },
    invoices: { title: 'سجل الفواتير والعمليات', sub: 'عرض تفصيلي لجميع فواتير الجلسات وطلبات الكافيه' },
    inventory: { title: 'إدارة المخزن والمشروبات', sub: 'مراقبة كميات البضاعة وأسعار الشراء والبيع وتنبيهات النقص' },
    reports: { title: 'التقارير المالية والأداء', sub: 'إحصائيات الإيرادات، الأرباح، والأصناف الأكثر طلباً' },
    expenses: { title: 'المصروفات اليومية والنثريات', sub: 'تسجيل مصاريف الصيانة وفواتير الكهرباء والخامات' },
    settings: { title: 'الإعدادات وتسعير الأجهزة', sub: 'ضبط أسعار الفردي والزوجي، وإدارة الأجهزة وطاقم العمل' },
  };

  const currentInfo = titles[activeTab] || titles.devices;

  return (
    <header className="sticky top-0 z-30 bg-[#0A0D14]/90 backdrop-blur-md border-b border-[#232C42] px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-[#131722] border border-[#232C42] text-slate-300 hover:text-white"
            aria-label="فتح القائمة الجانبية"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {currentInfo.title}
            </h2>
            <p className="text-xs text-slate-400 hidden sm:block">
              {currentInfo.sub}
            </p>
          </div>
        </div>

        {/* Right: Quick Stats, Live Clock & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Active devices counter */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131722] border border-[#232C42]">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00E676]" />
            <span className="text-xs font-semibold text-slate-300">
              الأجهزة النشطة:
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono-numbers">
              {activeDevicesCount} / {devices.length}
            </span>
          </div>

          {/* Today's Revenue */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-950/30 border border-violet-500/30">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-slate-300">إيراد اليوم:</span>
            <span className="text-xs font-bold text-violet-300 font-mono-numbers">
              {formatCurrency(todayRevenue)}
            </span>
          </div>

          {/* Live Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131722] border border-[#232C42] text-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold font-mono-numbers text-slate-200">
              {timeStr || '--:--'}
            </span>
          </div>

          {/* Quick POS button if not already in POS */}
          {activeTab !== 'pos' && (
            <Button
              size="sm"
              variant="primary"
              icon={ShoppingBag}
              onClick={() => setActiveTab('pos')}
              className="hidden sm:inline-flex"
            >
              طلب كافيه سريع
            </Button>
          )}

          {/* Audio toggle button */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isMuted
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                : 'bg-[#131722] border-[#232C42] text-emerald-400 hover:bg-slate-800'
            }`}
            title={isMuted ? 'الصوت مكتوم' : 'الصوت يعمل'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import {
  Gamepad2,
  ShoppingBag,
  Receipt,
  Package,
  BarChart3,
  Coins,
  Settings,
  ShieldCheck,
  Power,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { Badge } from '../common/Badge';

export function Sidebar({ isOpen, onClose }) {
  const {
    activeTab,
    setActiveTab,
    settings,
    activeStaffMember,
    activeDevicesCount,
    lowStockItems,
    setShiftClosureModalOpen,
    setStaffPinModalOpen,
  } = useApp();

  const { isMuted, toggleMute } = useAudio();

  const navItems = [
    {
      id: 'devices',
      label: 'الأجهزة والجلسات',
      icon: Gamepad2,
      badge: activeDevicesCount > 0 ? `${activeDevicesCount} مشغول` : null,
      badgeColor: 'success',
    },
    {
      id: 'pos',
      label: 'كاشير الكافيه (POS)',
      icon: ShoppingBag,
    },
    {
      id: 'invoices',
      label: 'سجل الفواتير',
      icon: Receipt,
    },
    {
      id: 'inventory',
      label: 'المخزن والمنتجات',
      icon: Package,
      badge: lowStockItems.length > 0 ? `${lowStockItems.length} ناقص` : null,
      badgeColor: 'danger',
    },
    {
      id: 'reports',
      label: 'التقارير والإحصائيات',
      icon: BarChart3,
    },
    {
      id: 'expenses',
      label: 'سجل المصروفات',
      icon: Coins,
    },
    {
      id: 'settings',
      label: 'الإعدادات والأسعار',
      icon: Settings,
    },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 bottom-0 right-0 z-50 w-72 bg-[#0E121C] border-l border-[#232C42]
          flex flex-col justify-between transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#1E2638]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Gamepad2 className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-base font-black text-white tracking-wide">
                  {settings.loungeName || 'VIP GAMING'}
                </h1>
                <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  نظام الإدارة المتكامل v2.5
                </p>
              </div>
            </div>

            <button
              onClick={toggleMute}
              title={isMuted ? 'تشغيل التنبيهات الصوتية' : 'كتم التنبيهات'}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold
                  transition-all duration-150 cursor-pointer text-right group
                  ${
                    isActive
                      ? 'bg-violet-600/15 text-white border border-violet-500/40 shadow-sm shadow-violet-500/10'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      p-1.5 rounded-lg transition-colors
                      ${
                        isActive
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-800/80 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <Badge variant={item.badgeColor || 'default'} size="sm">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer: Cashier & Shift Handover */}
        <div className="p-4 border-t border-[#1E2638] bg-[#0A0D14]/80 space-y-3">
          {/* Active Cashier Profile */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#131722] border border-[#232C42]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white truncate max-w-[110px]">
                  {activeStaffMember.name}
                </p>
                <p className="text-[10px] text-slate-400">{activeStaffMember.role}</p>
              </div>
            </div>

            <button
              onClick={() => setStaffPinModalOpen(true)}
              className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 px-2 py-1 rounded bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
            >
              تبديل
            </button>
          </div>

          {/* Shift Closure Button */}
          <button
            onClick={() => setShiftClosureModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 font-bold text-xs transition-all shadow-sm cursor-pointer"
          >
            <Power className="w-3.5 h-3.5 text-rose-400" />
            <span>تقفيل الوردية الحالية (Z-Report)</span>
          </button>
        </div>
      </aside>
    </>
  );
}

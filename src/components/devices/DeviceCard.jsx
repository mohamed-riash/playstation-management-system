import React from 'react';
import {
  Gamepad2,
  Gamepad,
  Monitor,
  Tv,
  CircleDot,
  Play,
  Pause,
  PlusCircle,
  Coffee,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  User,
} from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDuration, calculateSessionCost } from '../../utils/formatters';
import { SESSION_MODES } from '../../utils/constants';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

const DEVICE_ICON_MAP = {
  ps5: Gamepad2,
  ps4: Gamepad,
  pc: Monitor,
  vip: Tv,
  billiards: CircleDot,
};

export function DeviceCard({
  device,
  onStartSession,
  onAddOrder,
  onCheckout,
  onTransfer,
}) {
  const { pauseSession, resumeSession, switchMode, settings } = useApp();
  const session = device.activeSession;

  const {
    elapsedSeconds,
    remainingSeconds,
    progressPercent,
    isTimeUp,
    isWarning,
    isPaused,
  } = useTimer(session, settings.warningCountdownMinutes || 5);

  const Icon = DEVICE_ICON_MAP[device.type] || Gamepad2;
  const isOccupied = device.status === 'occupied' && session;

  // Rate calculation
  const currentMode = session?.mode || 'single';
  const hourlyRate = device.rates?.[currentMode] || device.rates?.single || 40;
  const timeCost = isOccupied ? calculateSessionCost(elapsedSeconds, hourlyRate) : 0;

  // Orders subtotal
  const ordersTotal = (session?.orders || []).reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const totalAccumulatedCost = timeCost + ordersTotal;

  // Next mode for quick toggle
  const nextMode = currentMode === 'single' ? 'multi' : 'single';

  return (
    <div
      className={`
        relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden
        ${
          isOccupied
            ? isTimeUp
              ? 'bg-[#181216] border-rose-500/70 shadow-neon-red animate-pulse-slow'
              : isWarning
              ? 'bg-[#191512] border-amber-500/60 shadow-[0_0_20px_-3px_rgba(245,158,11,0.3)]'
              : 'bg-[#131722] border-emerald-500/40 shadow-[0_0_20px_-5px_rgba(0,230,118,0.25)]'
            : 'bg-[#111520] border-[#20273B] hover:border-slate-700'
        }
      `}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-[#1F273E] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`
              w-9 h-9 rounded-xl flex items-center justify-center font-bold
              ${
                isOccupied
                  ? isTimeUp
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }
            `}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="text-right">
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              {device.name}
            </h3>
            <p className="text-[11px] text-slate-400">{device.screenSize || 'شاشة عالية الدقة'}</p>
          </div>
        </div>

        {/* Status Badge */}
        {isOccupied ? (
          <Badge
            variant={isTimeUp ? 'danger' : isWarning ? 'warning' : 'success'}
            dot
            size="sm"
          >
            {isTimeUp ? 'انتهى الوقت!' : isPaused ? 'مؤقت متوقف' : 'مشغول الآن'}
          </Badge>
        ) : (
          <Badge variant="default" size="sm">
            متاح للتشغيل
          </Badge>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {isOccupied ? (
          <>
            {/* Session Info: Customer & Mode */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[130px]" title={session.customerName}>
                  {session.customerName}
                </span>
              </div>

              {/* Mode tag & quick switch */}
              <button
                onClick={() => switchMode(device.id, nextMode)}
                title={`اضغط للتبديل إلى ${SESSION_MODES[nextMode]?.label}`}
                className={`
                  text-[11px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 cursor-pointer transition-colors
                  ${SESSION_MODES[currentMode]?.badgeColor}
                  hover:scale-105 active:scale-95
                `}
              >
                <span>لعب {SESSION_MODES[currentMode]?.label}</span>
                <span className="text-[9px] opacity-70 underline">({SESSION_MODES[nextMode]?.label}؟)</span>
              </button>
            </div>

            {/* Timer Display Box */}
            <div
              className={`
                p-3.5 rounded-xl border text-center flex flex-col items-center justify-center relative overflow-hidden
                ${
                  isTimeUp
                    ? 'bg-rose-950/40 border-rose-500/40'
                    : isWarning
                    ? 'bg-amber-950/30 border-amber-500/30'
                    : 'bg-[#0B0E17] border-[#1F273E]'
                }
              `}
            >
              {session.type === 'fixed' ? (
                <>
                  <div className="flex items-center justify-between w-full text-[11px] text-slate-400 mb-1">
                    <span>الوقت المتبقي:</span>
                    <span>إجمالي {session.durationMinutes} دقيقة</span>
                  </div>

                  <div className="text-3xl font-black font-mono-numbers tracking-tight text-white my-0.5">
                    {formatDuration(remainingSeconds)}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        isTimeUp
                          ? 'bg-rose-500'
                          : isWarning
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between w-full text-[11px] text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      جلسة وقت مفتوح:
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({hourlyRate} ج.م / ساعة)
                    </span>
                  </div>

                  <div className="text-3xl font-black font-mono-numbers tracking-tight text-emerald-400 my-0.5">
                    {formatDuration(elapsedSeconds)}
                  </div>
                </>
              )}

              {/* Pause indicator */}
              {isPaused && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center text-amber-400 text-xs font-bold gap-1.5">
                  <Pause className="w-4 h-4" />
                  المؤقت متوقف مؤقتاً
                </div>
              )}
            </div>

            {/* Live Cost & Orders Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="text-slate-400">تكلفة الوقت:</span>
                <span className="font-bold text-white font-mono-numbers">
                  {formatCurrency(timeCost)}
                </span>
              </div>

              {/* Cafe Orders link */}
              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={() => onAddOrder(device)}
                  className="flex items-center gap-1 text-slate-300 hover:text-white font-medium cursor-pointer"
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-400" />
                  <span>طلبات الكافيه:</span>
                  <span className="text-[11px] text-slate-400">
                    ({(session.orders || []).reduce((sum, o) => sum + o.qty, 0)} صنف)
                  </span>
                </button>
                <span className="font-bold text-amber-400 font-mono-numbers">
                  {formatCurrency(ordersTotal)}
                </span>
              </div>

              <div className="pt-2 border-t border-[#1F273E] flex items-center justify-between text-sm">
                <span className="font-bold text-slate-200">الإجمالي المستحق:</span>
                <span className="text-base font-black text-emerald-400 font-mono-numbers">
                  {formatCurrency(totalAccumulatedCost)}
                </span>
              </div>
            </div>
          </>
        ) : (
          /* Available Device View */
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#181E2F] border border-[#232C42] flex items-center justify-center text-slate-400">
              <Icon className="w-6 h-6 text-slate-500" />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400">الجهاز متاح ومستعد للعب</p>
              <div className="flex justify-center items-center gap-2 text-xs font-semibold text-slate-300">
                <span>فردي: {device.rates?.single || 40} ج.م</span>
                <span>•</span>
                <span>زوجي: {device.rates?.multi || 60} ج.م</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-3.5 border-t border-[#1F273E] bg-[#0E121C]">
        {isOccupied ? (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-1.5">
              {/* Pause / Resume */}
              <button
                onClick={() =>
                  isPaused ? resumeSession(device.id) : pauseSession(device.id)
                }
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-1 border border-slate-700 cursor-pointer transition-colors"
                title={isPaused ? 'استئناف' : 'إيقاف مؤقت'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isPaused ? 'استئناف' : 'إيقاف'}</span>
              </button>

              {/* Add Cafe Order */}
              <button
                onClick={() => onAddOrder(device)}
                className="py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                title="إضافة طلب كافيه"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>+ طلب</span>
              </button>

              {/* Transfer Session */}
              <button
                onClick={() => onTransfer(device)}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-1 border border-slate-700 cursor-pointer transition-colors"
                title="نقل الجلسة لجهاز آخر"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
                <span>نقل</span>
              </button>
            </div>

            {/* Primary Checkout Button */}
            <Button
              fullWidth
              variant="primary"
              size="md"
              icon={CheckCircle2}
              onClick={() => onCheckout(device, { elapsedSeconds, timeCost, ordersTotal, totalAccumulatedCost })}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-bold"
            >
              إنهاء الجلسة والحساب ({formatCurrency(totalAccumulatedCost)})
            </Button>
          </div>
        ) : (
          <Button
            fullWidth
            variant="success"
            size="md"
            icon={Play}
            onClick={() => onStartSession(device)}
          >
            بدء جلسة جديدة
          </Button>
        )}
      </div>
    </div>
  );
}

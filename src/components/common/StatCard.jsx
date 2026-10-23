import React from 'react';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'purple', // green, purple, cyan, amber, red
  trend,
  className = '',
}) {
  const colorMap = {
    green: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]',
      border: 'border-emerald-500/30',
    },
    purple: {
      bg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      glow: 'shadow-[0_0_15px_-3px_rgba(139,92,246,0.15)]',
      border: 'border-violet-500/30',
    },
    cyan: {
      bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)]',
      border: 'border-cyan-500/30',
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)]',
      border: 'border-amber-500/30',
    },
    red: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      glow: 'shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)]',
      border: 'border-rose-500/30',
    },
  };

  const scheme = colorMap[color] || colorMap.purple;

  return (
    <div
      className={`
        bg-[#131722] border border-[#232C42] rounded-2xl p-4 sm:p-5 flex items-start justify-between
        transition-all duration-200 hover:border-slate-600 ${scheme.glow} ${className}
      `}
    >
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-slate-400">{title}</p>
        <h4 className="text-2xl font-black text-white tracking-tight font-mono-numbers">
          {value}
        </h4>
        {subtitle && (
          <p className="text-xs text-slate-500 font-normal">{subtitle}</p>
        )}
      </div>

      {Icon && (
        <div className={`p-3 rounded-xl border ${scheme.bg} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}

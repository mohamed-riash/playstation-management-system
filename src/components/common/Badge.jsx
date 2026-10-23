import React from 'react';

export function Badge({
  children,
  variant = 'default', // success, danger, warning, info, purple, default
  size = 'sm', // sm, md
  dot = false,
  className = '',
}) {
  const variants = {
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    info: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    purple: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    default: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const dots = {
    success: 'bg-emerald-400 animate-pulse',
    danger: 'bg-rose-400',
    warning: 'bg-amber-400',
    info: 'bg-cyan-400',
    purple: 'bg-violet-400',
    default: 'bg-slate-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs rounded-full gap-1.5',
    md: 'px-2.5 py-1 text-sm rounded-full gap-2',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium border
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.sm}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dots[variant] || dots.default}`} />
      )}
      <span>{children}</span>
    </span>
  );
}

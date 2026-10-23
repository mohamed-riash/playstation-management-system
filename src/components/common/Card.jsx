import React from 'react';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  glowColor = 'green', // green, purple, cyan, red
  ...props
}) {
  const glowStyles = {
    green: 'border-emerald-500/40 shadow-neon-green',
    purple: 'border-violet-500/40 shadow-neon-purple',
    cyan: 'border-cyan-500/40 shadow-neon-cyan',
    red: 'border-rose-500/40 shadow-neon-red',
  };

  return (
    <div
      className={`
        bg-[#131722] border rounded-2xl p-4 sm:p-5
        ${glow ? glowStyles[glowColor] : 'border-[#232C42]'}
        ${hoverEffect ? 'transition-all duration-200 hover:border-slate-600 hover:shadow-lg' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

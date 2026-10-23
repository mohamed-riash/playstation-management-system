import React from 'react';
import { useAudio } from '../../context/AudioContext';

export function Button({
  children,
  onClick,
  variant = 'primary', // primary, success, danger, secondary, outline, ghost
  size = 'md', // sm, md, lg
  icon: Icon,
  iconPosition = 'right',
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
  playSound = true,
  ...props
}) {
  const { playTone } = useAudio();

  const handleClick = (e) => {
    if (disabled) return;
    if (playSound) playTone('click');
    if (onClick) onClick(e);
  };

  const variants = {
    primary:
      'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/25 border border-violet-500/30 active:scale-[0.98]',
    success:
      'bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-lg shadow-emerald-500/20 border border-emerald-400/40 active:scale-[0.98]',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 border border-rose-500/30 active:scale-[0.98]',
    secondary:
      'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/60 active:scale-[0.98]',
    outline:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 border border-slate-700 hover:border-slate-500',
    ghost:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white',
    cyan:
      'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/25 border border-cyan-500/30 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}

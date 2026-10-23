import React from 'react';

export function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  helperText,
  className = '',
  required = false,
  ...props
}) {
  return (
    <div className="w-full space-y-1.5 text-right">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full rounded-xl bg-[#0F131D] border text-slate-100 text-sm placeholder-slate-500
            transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
            ${Icon ? 'pr-10 pl-3' : 'px-3.5'} py-2.5
            ${error ? 'border-rose-500/80 focus:ring-rose-500/30' : 'border-[#232C42] hover:border-slate-700'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-400 mt-1">{helperText}</p>}
    </div>
  );
}

export function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  error,
  className = '',
  required = false,
  ...props
}) {
  return (
    <div className="w-full space-y-1.5 text-right">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full rounded-xl bg-[#0F131D] border text-slate-100 text-sm px-3.5 py-2.5
          transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
          ${error ? 'border-rose-500/80 focus:ring-rose-500/30' : 'border-[#232C42] hover:border-slate-700'}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#131722] text-slate-100">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  );
}

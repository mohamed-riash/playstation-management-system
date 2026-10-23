import React from 'react';

export function Table({
  headers = [],
  children,
  emptyMessage = 'لا توجد بيانات متاحة حالياً',
  isEmpty = false,
  className = '',
}) {
  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-[#232C42] bg-[#131722] ${className}`}>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-[#181E2F] text-xs font-semibold text-slate-400 border-b border-[#232C42]">
            <tr>
              {headers.map((h, idx) => (
                <th key={idx} className="px-4 py-3.5 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F273E] text-slate-200">
            {isEmpty ? (
              <tr>
                <td
                  colSpan={headers.length || 1}
                  className="px-4 py-12 text-center text-slate-400 text-sm font-medium"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

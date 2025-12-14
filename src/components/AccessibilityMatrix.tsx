import React from 'react';
import { PaletteData } from '../types';
import { getContrastRatio } from '../services/utils';
import { HelpCircle } from 'lucide-react';

interface AccessibilityMatrixProps { palette: PaletteData; }

const AccessibilityMatrix: React.FC<AccessibilityMatrixProps> = ({ palette }) => {
  const colors = palette.colors;
  const getRating = (ratio) => {
    if (ratio >= 7) return { label: 'AAA', color: 'text-green-600', bg: 'bg-green-100' };
    if (ratio >= 4.5) return { label: 'AA', color: 'text-green-500', bg: 'bg-green-50' };
    if (ratio >= 3) return { label: 'AA Large', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Fail', color: 'text-red-500', bg: 'bg-red-50' };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-slate-800">Accessibility Contrast Matrix</h3>
          <div className="group relative">
            <HelpCircle className="w-5 h-5 text-slate-400 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              WCAG AA requires 4.5:1. Large text requires 3:1.
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className="p-4 bg-slate-50 border-b border-slate-200 min-w-[120px]">Bg \ Text</th>
              {colors.map((color, i) => (
                <th key={i} className="p-4 bg-slate-50 border-b border-slate-200 text-center">
                  <div className="w-8 h-8 rounded-full border border-slate-200 shadow-sm mx-auto" style={{ backgroundColor: color }}></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {colors.map((bgColor, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 border-b border-slate-100 font-medium bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: bgColor }}></div>
                    <span className="font-mono text-xs text-slate-600 hidden sm:inline">{bgColor}</span>
                  </div>
                </td>
                {colors.map((fgColor, colIndex) => {
                  if (rowIndex === colIndex) return <td key={colIndex} className="p-4 border-b border-slate-100 text-center bg-slate-50/50"><span className="text-slate-300">-</span></td>;
                  const ratio = getContrastRatio(fgColor, bgColor);
                  const { label, color, bg } = getRating(ratio);
                  return (
                    <td key={colIndex} className="p-4 border-b border-slate-100 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-lg text-slate-800">{ratio.toFixed(2)}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${bg} ${color}`}>{label}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AccessibilityMatrix;
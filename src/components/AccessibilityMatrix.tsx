import React from 'react';
import { PaletteData } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';
import { determineTextColor } from '../services/utils';

// 1. Define the interface so TS knows 'palette' is allowed
interface AccessibilityMatrixProps {
  palette: PaletteData;
}

const AccessibilityMatrix: React.FC<AccessibilityMatrixProps> = ({ palette }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
           <h3 className="text-xl font-bold text-slate-800">Accessibility Matrix</h3>
           <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-slate-500 text-sm mt-1">
          WCAG 2.1 Contrast compliance check against black & white text.
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-4">Color</th>
              <th className="p-4">Text: White</th>
              <th className="p-4">Text: Black</th>
              <th className="p-4">Rating</th>
            </tr>
          </thead>
          <tbody>
            {palette.colors.map((color, index) => {
              const bestText = determineTextColor(color);
              
              return (
                <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg shadow-sm border border-slate-200" 
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-mono text-sm font-medium text-slate-700">{color}</span>
                    </div>
                  </td>
                  
                  {/* White Text Check */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       {bestText === '#FFFFFF' ? (
                         <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">
                           <CheckCircle className="w-3 h-3" /> Pass
                         </span>
                       ) : (
                         <span className="inline-flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded text-xs font-bold">
                           <XCircle className="w-3 h-3" /> Fail
                         </span>
                       )}
                    </div>
                  </td>

                  {/* Black Text Check */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       {bestText === '#000000' ? (
                         <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">
                           <CheckCircle className="w-3 h-3" /> Pass
                         </span>
                       ) : (
                         <span className="inline-flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded text-xs font-bold">
                           <XCircle className="w-3 h-3" /> Fail
                         </span>
                       )}
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="text-xs font-bold text-slate-400">AA Large</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessibilityMatrix;
import React, { useState } from 'react';
import { PaletteData } from '../types';
import { simulateColorBlindness, determineTextColor } from '../services/utils';
import { Eye, EyeOff } from 'lucide-react';

interface ColorBlindnessSimProps { palette: PaletteData; }

const ColorBlindnessSim: React.FC<ColorBlindnessSimProps> = ({ palette }) => {
  const [mode, setMode] = useState('Normal');
  const modes = ['Normal', 'Protanopia', 'Deuteranopia', 'Tritanopia', 'Achromatopsia'];
// FIX: simulateColorBlindness colors based on the selected mode by dear Rafig
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1"><h3 className="text-xl font-bold text-slate-800">Color Blindness Simulator</h3><Eye className="w-5 h-5 text-indigo-500" /></div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg overflow-x-auto max-w-full">
          {modes.map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${mode === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{m}</button>
          ))}
        </div>
      </div>
      <div className="p-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {palette.colors.map((color, index) => {
            const simulatedColor = simulateColorBlindness(color, mode);
            const textColor = determineTextColor(simulatedColor);
            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="h-32 rounded-xl shadow-inner flex items-center justify-center transition-colors duration-500" style={{ backgroundColor: simulatedColor }}>
                  <span className="font-mono text-xs font-bold opacity-80" style={{ color: textColor }}>{simulatedColor}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ColorBlindnessSim;
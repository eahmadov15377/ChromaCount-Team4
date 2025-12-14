import React, { useState, useEffect } from 'react';
import { Check, Copy, Download, ChevronDown } from 'lucide-react';
import { PaletteData, ColorFormat } from '../types';
import { formatColor, determineTextColor, generateCssVariables, generateScssVariables, generateTailwindConfig, generateJson, getHexLuminance, getHue } from '../services/utils';

interface PaletteDisplayProps {
  palette: PaletteData;
  colorFormat: ColorFormat;
  onFormatChange: (format: ColorFormat) => void;
}

const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ palette, colorFormat, onFormatChange }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [sortedColors, setSortedColors] = useState<string[]>(palette.colors);
  const [sortMethod, setSortMethod] = useState('ORIGINAL');

  useEffect(() => {
    setSortedColors(palette.colors);
    setSortMethod('ORIGINAL');
  }, [palette]);

  const handleCopy = (color, index) => {
    navigator.clipboard.writeText(formatColor(color, colorFormat));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExport = (format) => {
    let content = '', filename = 'palette', type = 'text/plain';
    if (format === 'CSS') { content = generateCssVariables(sortedColors); filename = 'chromacount.css'; type = 'text/css'; }
    else if (format === 'SCSS') { content = generateScssVariables(sortedColors); filename = '_palette.scss'; type = 'text/x-scss'; }
    else if (format === 'TAILWIND') { content = generateTailwindConfig(sortedColors); filename = 'tailwind.config.js'; type = 'application/javascript'; }
    else if (format === 'JSON') { content = generateJson(sortedColors); filename = 'palette.json'; type = 'application/json'; }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleSort = (method) => {
    setSortMethod(method);
    if (method === 'ORIGINAL') setSortedColors(palette.colors);
    else if (method === 'LUMINANCE') setSortedColors([...palette.colors].sort((a, b) => getHexLuminance(b) - getHexLuminance(a)));
    else if (method === 'HUE') setSortedColors([...palette.colors].sort((a, b) => getHue(a) - getHue(b)));
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex-1">
           <div className="flex flex-wrap gap-2 mb-3">
            {palette.moodTags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">{tag}</span>
            ))}
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Generated Palette</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 h-10 shadow-sm">
            {['ORIGINAL', 'LUMINANCE', 'HUE'].map(m => (
              <button key={m} onClick={() => handleSort(m)} className={`px-3 h-full rounded text-xs font-medium transition-all ${sortMethod === m ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>{m === 'ORIGINAL' ? 'Original' : m === 'LUMINANCE' ? 'Bright' : 'Hue'}</button>
            ))}
          </div>
          <div className="flex bg-slate-100 rounded-lg p-1 h-10">
            {['HEX', 'RGB', 'HSL'].map((fmt) => (
              <button key={fmt} onClick={() => onFormatChange(fmt)} className={`px-3 rounded-md text-xs font-bold transition-all ${colorFormat === fmt ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{fmt}</button>
            ))}
          </div>
          <div className="relative">
            <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-2 px-4 h-10 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95">
              <Download className="w-4 h-4" /> <span className="hidden sm:inline font-medium text-sm">Export</span> <ChevronDown className="w-3 h-3" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20">
                {['CSS', 'SCSS', 'TAILWIND', 'JSON'].map(f => (
                  <button key={f} onClick={() => handleExport(f)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600">{f}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {sortedColors.map((color, index) => {
          const textColor = determineTextColor(color);
          const isCopied = copiedIndex === index;
          return (
            <div key={`${color}-${index}`} onClick={() => handleCopy(color, index)} className="group relative h-48 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden border border-slate-100 ring-4 ring-transparent hover:ring-white/50" style={{ backgroundColor: color }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                <div className="px-4 py-2 rounded-lg backdrop-blur-md bg-white/30 shadow-lg flex items-center gap-2 border border-white/20" style={{ color: textColor }}>
                  {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  <span className="font-mono font-medium text-sm">{isCopied ? 'Copied' : 'Copy'}</span>
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/40 to-transparent">
                 <p className="font-mono text-center text-lg font-bold tracking-wider" style={{ color: textColor }}>{formatColor(color, colorFormat)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default PaletteDisplay;
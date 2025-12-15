import React from 'react';
import { PaletteData } from '../types';
import { Clock, Trash2, ArrowLeft } from 'lucide-react';
import { getHistory, clearHistory } from '../services/storage';

interface HistoryPanelProps {
  onSelect: (palette: PaletteData) => void;
  currentId?: string;
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger: number;
}

// well done Fikrat for implementing history panel, reference: Dropzone.tsx for React.FC usage
const HistoryPanel: React.FC<HistoryPanelProps> = ({ onSelect, currentId, isOpen, onClose, refreshTrigger }) => {
  const [history, setHistory] = React.useState<PaletteData[]>([]);

  React.useEffect(() => { setHistory(getHistory()); }, [isOpen, refreshTrigger]);

  const handleClear = () => {
    if (confirm('Are you sure?')) { clearHistory(); setHistory([]); }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
      <div className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-l border-slate-100 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-slate-100 bg-white/50">
           <button onClick={onClose} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium mb-4 w-full px-2 py-2 rounded-lg hover:bg-slate-100 transition-colors">
             <ArrowLeft className="w-4 h-4" /> Back to App
           </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800"><Clock className="w-5 h-5 text-indigo-500" /><h2 className="font-bold text-lg">Recent History</h2></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-center"><p className="text-sm">No recent palettes.</p></div>
          ) : (
            history.map((item) => (
              <div key={item.id} onClick={() => { onSelect(item); if (window.innerWidth < 1024) onClose(); }} className={`group relative border rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 ${item.id === currentId ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-indigo-300'}`}>
                <div className="h-28 w-full bg-slate-100 relative overflow-hidden">
                   <img src={item.imageUrl} alt="Analysis Source" className="w-full h-full object-cover" />
                   <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                      <div className="flex gap-1">{item.colors.slice(0, 5).map((c, i) => (<div key={i} className="w-5 h-5 rounded-full border border-white/50 shadow-sm" style={{ backgroundColor: c }} />))}</div>
                   </div>
                </div>
                <div className="p-3 bg-white">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.moodTags.slice(0, 3).map((tag, i) => (<span key={i} className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">{tag}</span>))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/80">
            <button onClick={handleClear} className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl text-sm font-semibold transition-colors"><Trash2 className="w-4 h-4" /> Clear All History</button>
          </div>
        )}
      </div>
    </>
  );
};
export default HistoryPanel;
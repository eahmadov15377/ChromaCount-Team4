
import React, { useState } from 'react';
import { Palette, History as HistoryIcon, ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Dropzone from '../components/Dropzone';
import PaletteDisplay from '../components/PaletteDisplay';
import AccessibilityMatrix from '../components/AccessibilityMatrix';
import HistoryPanel from '../components/HistoryPanel';
import ColorBlindnessSim from '../components/ColorBlindnessSim';
import { analyzeImage } from '../services/gemini';
import { saveToHistory } from '../services/storage';
import { PaletteData, ColorFormat, ViewMode } from '../types';


interface AccessibilityMatrixProps {
  palette: PaletteData;
}



const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.UPLOAD);
  // Fix: Add explicit generic type <PaletteData | null>
  const [currentPalette, setCurrentPalette] = useState<PaletteData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // Fix: Add explicit generic type <ColorFormat>
  const [colorFormat, setColorFormat] = useState<ColorFormat>('HEX');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyTrigger, setHistoryTrigger] = useState(0); 

  // Fix: Type the file parameter
  const handleImageSelect = async (file: File) => {
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onloadend = async () => {
      // Fix: Cast result to string (it can be string | ArrayBuffer | null)
      const base64String = reader.result as string;
      
      if (!base64String) {
        setIsProcessing(false);
        return;
      }

      try {
        const analysis = await analyzeImage(base64String);
        
        const newPalette: PaletteData = {
          id: uuidv4(),
          colors: analysis.colors,
          moodTags: analysis.moodTags,
          imageUrl: base64String,
          timestamp: Date.now()
        };

        setCurrentPalette(newPalette);
        saveToHistory(newPalette);
        setHistoryTrigger(prev => prev + 1);
        setViewMode(ViewMode.ANALYSIS);
      } catch (error) {
        console.error(error);
        alert("Error analyzing image. Please ensure your API key is configured and try again.");
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setIsProcessing(false);
      alert("Failed to read file.");
    };
  };

  // Fix: Type the palette parameter
  const handleHistorySelect = (palette: PaletteData) => {
    setCurrentPalette(palette);
    setViewMode(ViewMode.ANALYSIS);
    setIsHistoryOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setViewMode(ViewMode.UPLOAD)}>
            <div className="bg-indigo-600 p-2 rounded-xl transition-transform group-hover:scale-110">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              ChromaCount
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {viewMode === ViewMode.ANALYSIS && (
              <button 
                onClick={() => setViewMode(ViewMode.UPLOAD)}
                className="hidden md:flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-semibold transition-colors bg-slate-50 hover:bg-indigo-50 px-4 py-2 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                New Analysis
              </button>
            )}
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="View History"
            >
              <HistoryIcon className="w-5 h-5" />
              <span className="hidden sm:inline font-medium text-sm">History</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {viewMode === ViewMode.UPLOAD ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="text-center mb-10 max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                Unlock the colors of <br className="hidden md:block" />
                <span className="text-indigo-600">your inspiration.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Upload any image to extract a dominant color palette, analyze mood, and verify accessibility compliance instantly using Gemini AI.
              </p>
            </div>
            
            <Dropzone onImageSelected={handleImageSelect} isProcessing={isProcessing} />
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in pb-12">
            {currentPalette && (
              <>
                <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl relative group">
                   <img 
                      src={currentPalette.imageUrl} 
                      alt="Analyzed Source" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                   <div className="absolute bottom-6 left-6">
                      <p className="text-white/80 text-sm font-mono mb-1">Source Image</p>
                      <h2 className="text-white text-2xl font-bold">Analysis Result</h2>
                   </div>
                </div>

                <PaletteDisplay 
                  palette={currentPalette} 
                  colorFormat={colorFormat}
                  onFormatChange={setColorFormat}
                />
                
                <div className="grid grid-cols-1 gap-12">
                  <ColorBlindnessSim palette={currentPalette} />
                  <AccessibilityMatrix palette={currentPalette} />
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 font-medium mb-2">ChromaCount</p>
          <p className="text-slate-400 text-sm">Powered by Google Gemini AI & React.</p>
        </div>
      </footer>

      {/* History Sidebar */}
      <HistoryPanel 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onSelect={handleHistorySelect}
        currentId={currentPalette?.id}
        refreshTrigger={historyTrigger}
      />
    </div>
  );
};

export default App;

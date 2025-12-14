import { PaletteData } from '../types';

const STORAGE_KEY = 'chromacount_history';
const MAX_HISTORY = 5;

export const saveToHistory = (palette: PaletteData) => {
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    const existing: PaletteData[] = existingRaw ? JSON.parse(existingRaw) : [];
    const updated = [palette, ...existing].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to save history to localStorage", e);
  }
};

export const getHistory = (): PaletteData[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
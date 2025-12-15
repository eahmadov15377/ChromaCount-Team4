export interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
}

export interface PaletteData {
  id: string;
  colors: string[];
  moodTags: string[];
  imageUrl: string;
  timestamp: number;
}

export type ColorFormat = 'HEX' | 'RGB' | 'HSL';

export interface AccessibilityResult {
  fg: string;
  bg: string;
  ratio: number;
  aa: boolean;
  aaLarge: boolean;
  aaa: boolean;
  aaaLarge: boolean;
}
// fikrat okay nice , thanks for adding these types
export enum ViewMode {
  UPLOAD = 'UPLOAD',
  ANALYSIS = 'ANALYSIS'
}

export type ExportFormat = 'CSS' | 'SCSS' | 'TAILWIND' | 'JSON';

export type ColorBlindnessMode = 'Normal' | 'Protanopia' | 'Deuteranopia' | 'Tritanopia' | 'Achromatopsia';
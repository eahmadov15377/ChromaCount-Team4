import { ColorFormat, ColorBlindnessMode } from '../types';

interface RGB {
  r: number;
  g: number;
  b: number;
}

export const hexToRgbValues = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

const componentToHex = (c: number): string => {
  const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const getLuminance = (r: number, g: number, b: number): number => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export const getHexLuminance = (hex: string): number => {
  const rgb = hexToRgbValues(hex);
  if (!rgb) return 0;
  return getLuminance(rgb.r, rgb.g, rgb.b);
};
//Khayyam thanks for noting error in getContrastRatio, good now
export const getContrastRatio = (hex1: string, hex2: string): number => {
  const rgb1 = hexToRgbValues(hex1);
  const rgb2 = hexToRgbValues(hex2);
  if (!rgb1 || !rgb2) return 0;

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

export const hexToHslString = (hex: string): string => {
  const rgb = hexToRgbValues(hex);
  if (!rgb) return '';
  let { r, g, b } = rgb;
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

export const getHue = (hex: string): number => {
  const rgb = hexToRgbValues(hex);
  if (!rgb) return 0;
  let { r, g, b } = rgb;
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return 0;
  const d = max - min;
  let h = 0;
  switch (max) {
    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    case g: h = (b - r) / d + 2; break;
    case b: h = (r - g) / d + 4; break;
  }
  return h * 60;
}

export const hexToRgbString = (hex: string): string => {
  const rgb = hexToRgbValues(hex);
  if (!rgb) return '';
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

export const formatColor = (hex: string, format: ColorFormat): string => {
  switch (format) {
    case 'HEX': return hex.toUpperCase();
    case 'RGB': return hexToRgbString(hex);
    case 'HSL': return hexToHslString(hex);
    default: return hex;
  }
};

export const determineTextColor = (backgroundColor: string): string => {
  const ratioWhite = getContrastRatio(backgroundColor, '#FFFFFF');
  const ratioBlack = getContrastRatio(backgroundColor, '#000000');
  return ratioWhite > ratioBlack ? '#FFFFFF' : '#000000';
};

export const generateCssVariables = (colors: string[]): string => {
  let css = ':root {\n';
  colors.forEach((color, index) => {
    css += `  --color-palette-${index + 1}: ${color};\n`;
  });
  css += '}';
  return css;
};

export const generateScssVariables = (colors: string[]): string => {
  let scss = '';
  colors.forEach((color, index) => {
    scss += `$color-palette-${index + 1}: ${color};\n`;
  });
  return scss;
};

export const generateTailwindConfig = (colors: string[]): string => {
  const config = {
    theme: {
      extend: {
        colors: {
          palette: colors.reduce((acc, color, index) => ({
            ...acc,
            [index + 100]: color
          }), {})
        }
      }
    }
  };
  return JSON.stringify(config, null, 2);
};

export const generateJson = (colors: string[]): string => {
  return JSON.stringify({ colors }, null, 2);
};

export const simulateColorBlindness = (hex: string, mode: string): string => {
  const rgb = hexToRgbValues(hex);
  if (!rgb || mode === 'Normal') return hex;
  const { r, g, b } = rgb;
  
  const transform = (matrix: number[]): string => {
    const R = r * matrix[0] + g * matrix[1] + b * matrix[2];
    const G = r * matrix[3] + g * matrix[4] + b * matrix[5];
    const B = r * matrix[6] + g * matrix[7] + b * matrix[8];
    return rgbToHex(R, G, B);
  };

  switch (mode) {
    case 'Protanopia': return transform([0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758]);
    case 'Deuteranopia': return transform([0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7]);
    case 'Tritanopia': return transform([0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525]);
    case 'Achromatopsia': return transform([0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114]);
    default: return hex;
  }
};
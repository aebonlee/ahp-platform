import { useState, useEffect } from 'react';

export type ColorTheme = 'blue' | 'gold' | 'green' | 'purple' | 'rose' | 'orange' | 'teal' | 'indigo' | 'icewhite';

interface ColorPalette {
  primary: string;
  secondary: string;
  light: string;
  hover: string;
  focus: string;
  rgb: string; // For opacity variations
}

// Define color palettes inspired by modern design systems
const colorPalettes: Record<ColorTheme, ColorPalette> = {
  blue: {
    primary: '#006B96',
    secondary: '#004F73',
    light: '#7FB8D3',
    hover: '#003F5C',
    focus: 'rgba(0, 107, 150, 0.35)',
    rgb: '0, 107, 150'
  },
  gold: {
    primary: '#C8A968',
    secondary: '#A98C4B',
    light: '#E5D5AA',
    hover: '#B59A4D',
    focus: 'rgba(200, 169, 104, 0.35)',
    rgb: '200, 169, 104'
  },
  green: {
    primary: '#10B981',
    secondary: '#059669',
    light: '#86EFAC',
    hover: '#047857',
    focus: 'rgba(16, 185, 129, 0.35)',
    rgb: '16, 185, 129'
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    light: '#C4B5FD',
    hover: '#6D28D9',
    focus: 'rgba(139, 92, 246, 0.35)',
    rgb: '139, 92, 246'
  },
  rose: {
    primary: '#F43F5E',
    secondary: '#E11D48',
    light: '#FDA4AF',
    hover: '#BE123C',
    focus: 'rgba(244, 63, 94, 0.35)',
    rgb: '244, 63, 94'
  },
  orange: {
    primary: '#F97316',
    secondary: '#EA580C',
    light: '#FDBA74',
    hover: '#DC2626',
    focus: 'rgba(249, 115, 22, 0.35)',
    rgb: '249, 115, 22'
  },
  teal: {
    primary: '#14B8A6',
    secondary: '#0D9488',
    light: '#5EEAD4',
    hover: '#0F766E',
    focus: 'rgba(20, 184, 166, 0.35)',
    rgb: '20, 184, 166'
  },
  indigo: {
    primary: '#6366F1',
    secondary: '#4F46E5',
    light: '#A5B4FC',
    hover: '#4338CA',
    focus: 'rgba(99, 102, 241, 0.35)',
    rgb: '99, 102, 241'
  },
  icewhite: {
    primary: '#F8FAFC',
    secondary: '#E2E8F0',
    light: '#FFFFFF',
    hover: '#CBD5E1',
    focus: 'rgba(248, 250, 252, 0.35)',
    rgb: '248, 250, 252'
  }
};

export const useColorTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(() => {
    const saved = localStorage.getItem('colorTheme') as ColorTheme;
    return saved || 'blue';
  });

  // Apply color theme to CSS variables (minimal, safe approach)
  const applyColorTheme = (theme: ColorTheme) => {
    const palette = colorPalettes[theme];
    const root = document.documentElement;

    // Only update theme-specific CSS variables to avoid breaking layout
    root.style.setProperty('--color-theme-primary', palette.primary);
    root.style.setProperty('--color-theme-secondary', palette.secondary);
    root.style.setProperty('--color-theme-light', palette.light);
    root.style.setProperty('--color-theme-hover', palette.hover);
    root.style.setProperty('--color-theme-focus', palette.focus);
    root.style.setProperty('--color-theme-rgb', palette.rgb);
  };

  // Apply theme on mount and changes
  useEffect(() => {
    applyColorTheme(currentTheme);
  }, [currentTheme]);

  // Change theme and persist
  const changeColorTheme = (theme: ColorTheme) => {
    setCurrentTheme(theme);
    localStorage.setItem('colorTheme', theme);
  };

  // Get all available themes
  const getAvailableThemes = (): ColorTheme[] => {
    return Object.keys(colorPalettes) as ColorTheme[];
  };

  // Get palette for specific theme
  const getPalette = (theme?: ColorTheme): ColorPalette => {
    return colorPalettes[theme || currentTheme];
  };

  return {
    currentTheme,
    changeColorTheme,
    getAvailableThemes,
    getPalette,
    colorPalettes
  };
};

export default useColorTheme;
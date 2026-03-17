import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
// material
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
//
import shape from './shape';
import palette from './palette';
import typography from './typography';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';

// ----------------------------------------------------------------------

import { MantineProvider, createTheme as createMantineTheme } from '@mantine/core';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'theme-mode';
const PORTAL_STORAGE_KEY = 'portal-template';
const AVAILABLE_MODES = ['dark', 'light', 'ocean', 'forest'];
const AVAILABLE_TEMPLATES = ['classic', 'bento', 'control'];

const ThemeModeContext = createContext({
  mode: 'dark',
  toggleThemeMode: () => {}
});

const PortalTemplateContext = createContext({
  template: 'bento',
  setTemplate: () => {}
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export function usePortalTemplate() {
  return useContext(PortalTemplateContext);
}

ThemeConfig.propTypes = {
  children: PropTypes.node
};

export default function ThemeConfig({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    const savedMode = localStorage.getItem(STORAGE_KEY);
    return AVAILABLE_MODES.includes(savedMode) ? savedMode : 'dark';
  });

  const [template, setTemplateState] = useState(() => {
    if (typeof window === 'undefined') {
      return 'bento';
    }
    const savedTemplate = localStorage.getItem(PORTAL_STORAGE_KEY);
    return AVAILABLE_TEMPLATES.includes(savedTemplate) ? savedTemplate : 'bento';
  });

  const toggleThemeMode = () => {
    setMode((prevMode) => {
      const currentIndex = AVAILABLE_MODES.indexOf(prevMode);
      const nextMode = AVAILABLE_MODES[(currentIndex + 1) % AVAILABLE_MODES.length];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, nextMode);
      }
      return nextMode;
    });
  };

  const setTemplate = (newTemplate) => {
    if (AVAILABLE_TEMPLATES.includes(newTemplate)) {
      setTemplateState(newTemplate);
      if (typeof window !== 'undefined') {
        localStorage.setItem(PORTAL_STORAGE_KEY, newTemplate);
      }
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-theme', mode);
      document.body.setAttribute('data-portal', template);
    }
  }, [mode, template]);

  const themeOptions = useMemo(
    () => {
      const getPaletteOptions = (mode) => {
        if (mode === 'dark') {
          return {
            ...palette,
            mode: 'dark',
            text: { primary: '#FFFFFF', secondary: '#B8BDC7', disabled: '#7C8798' },
            background: { paper: '#2A2D34', default: '#202124', neutral: '#303134' },
            action: {
              ...palette.action,
              active: '#B8BDC7', hover: 'rgba(145, 158, 171, 0.12)', selected: 'rgba(145, 158, 171, 0.2)',
              disabled: 'rgba(145, 158, 171, 0.5)', disabledBackground: 'rgba(145, 158, 171, 0.2)', focus: 'rgba(145, 158, 171, 0.2)'
            }
          };
        }
        
        const lightPalette = { ...palette, mode: 'light' };
        
        if (mode === 'ocean') {
          return {
            ...lightPalette,
            primary: { ...palette.primary, main: '#0077B6' },
            secondary: { ...palette.secondary, main: '#00B4D8' },
            text: { primary: '#06283D', secondary: '#24566F', disabled: '#5E7F90' },
            background: { paper: '#F4FBFF', default: '#EAF7FF', neutral: '#D6ECF8' }
          };
        }
        if (mode === 'forest') {
          return {
            ...lightPalette,
            primary: { ...palette.primary, main: '#2D6A4F' },
            secondary: { ...palette.secondary, main: '#40916C' },
            text: { primary: '#081C15', secondary: '#1B4332', disabled: '#52796F' },
            background: { paper: '#E8F5E9', default: '#F1F8E9', neutral: '#C8E6C9' }
          };
        }
        
        return lightPalette;
      };

      return {
        palette: getPaletteOptions(mode),
        shape,
        typography,
        shadows,
        customShadows
      };
    },
    [mode]
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  // Maintain separate Mantine theme configuration
  const mantineTheme = createMantineTheme({
    primaryColor: template === 'control' ? 'orange' : (mode === 'ocean' ? 'blue' : mode === 'forest' ? 'green' : 'teal'),
    colorScheme: mode === 'dark' ? 'dark' : 'light',
    fontFamily: 'Roboto, sans-serif',
    radius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        bento: template === 'classic' ? '12px' : (template === 'control' ? '8px' : '32px'),
      },
    other: {
      glassBackground: (template === 'classic') ? 'transparent' : (template === 'control' ? 'rgba(0,0,0,0.8)' : (mode === 'dark' 
        ? 'rgba(42, 45, 52, 0.4)' 
        : mode === 'ocean' 
          ? 'rgba(234, 247, 255, 0.6)' 
          : mode === 'forest' 
            ? 'rgba(241, 248, 233, 0.6)' 
            : 'rgba(255, 255, 255, 0.6)')),
      glassBlur: (template === 'classic') ? 'none' : 'blur(12px)',
      glassBorder: (template === 'classic') ? 'none' : (template === 'control' ? '1px solid #ff9800' : '1px solid rgba(255, 255, 255, 0.1)'),
    }
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--glass-bg', mantineTheme.other.glassBackground);
      root.style.setProperty('--glass-blur', mantineTheme.other.glassBlur);
      root.style.setProperty('--glass-border', mantineTheme.other.glassBorder);
    }
  }, [mantineTheme]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeModeContext.Provider value={{ mode, toggleThemeMode }}>
        <PortalTemplateContext.Provider value={{ template, setTemplate }}>
          <MantineProvider theme={mantineTheme} defaultColorScheme={mode === 'dark' ? 'dark' : 'light'}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </MantineProvider>
        </PortalTemplateContext.Provider>
      </ThemeModeContext.Provider>
    </StyledEngineProvider>
  );
}

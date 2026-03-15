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

const STORAGE_KEY = 'theme-mode';
const AVAILABLE_MODES = ['dark', 'light', 'ocean', 'forest', 'sunset'];

const ThemeModeContext = createContext({
  mode: 'dark',
  toggleThemeMode: () => {}
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
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

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-theme', mode);
    }
  }, [mode]);

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
        if (mode === 'sunset') {
          return {
            ...lightPalette,
            primary: { ...palette.primary, main: '#E07A5F' },
            secondary: { ...palette.secondary, main: '#E9C46A' },
            text: { primary: '#264653', secondary: '#2A9D8F', disabled: '#8AB17D' },
            background: { paper: '#FFEDD8', default: '#FFF3E0', neutral: '#FFE0B2' }
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

  return (
    <StyledEngineProvider injectFirst>
      <ThemeModeContext.Provider value={{ mode, toggleThemeMode }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </StyledEngineProvider>
  );
}

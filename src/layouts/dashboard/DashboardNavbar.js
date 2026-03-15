import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import sunFill from '@iconify/icons-eva/sun-fill';
import moonFill from '@iconify/icons-eva/moon-fill';
// material
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Tooltip } from '@mui/material';
// components
import { MHidden } from '../../components/@material-extend';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import { useThemeMode } from '../../theme';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 240;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const theme = useTheme();
  const { mode, toggleThemeMode } = useThemeMode();

  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>

        <Searchbar />
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Tooltip title={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
            <IconButton onClick={toggleThemeMode} sx={{ color: 'text.primary' }}>
              <Icon icon={mode === 'dark' ? sunFill : moonFill} />
            </IconButton>
          </Tooltip>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}

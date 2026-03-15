import PropTypes from 'prop-types';
// material
import { Box } from '@mui/material';
import { useThemeMode } from '../theme';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  const { mode } = useThemeMode();
  const filter = mode === 'dark' ? 'none' : 'invert(1)';
  
  return <Box component="img" src="/static/shree.png" sx={{ width: 40, height: 40, filter, ...sx }} />;
}

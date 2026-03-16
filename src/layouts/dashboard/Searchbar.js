import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import searchFill from '@iconify/icons-eva/search-fill';
// material
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Input,
  Slide,
  Button,
  InputAdornment,
  ClickAwayListener,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Typography
} from '@mui/material';
import IconM from '@mdi/react';
import { mdiFan, mdiWaterBoiler, mdiAirConditioner, mdiLightbulbVariant, mdiTelevision, mdiPower, mdiOpenInNew } from '@mdi/js';

// Constants and registry
import { deviceMap, gateway } from '../../constants/deviceMap';
import sidebarConfig from './SidebarConfig';

// ----------------------------------------------------------------------

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  alignItems: 'center',
  minHeight: APPBAR_MOBILE,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  backgroundColor: `${alpha(theme.palette.background.default, 0.85)}`,
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('md')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

const ResultsWrapper = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  maxHeight: '60vh',
  overflowY: 'auto',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.customShadows.z20,
  border: `1px solid ${theme.palette.divider}`
}));

// ----------------------------------------------------------------------

export default function Searchbar() {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState({ rooms: [], devices: [] });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults({ rooms: [], devices: [] });
      return;
    }

    const query = searchQuery.toLowerCase();

    // Filter Rooms from SidebarConfig
    const filteredRooms = sidebarConfig.filter((item) => 
      item.title.toLowerCase().includes(query)
    );

    // Filter Devices from DeviceMap
    const filteredDevices = deviceMap.filter((device) => 
      device.name.toLowerCase().includes(query) || 
      device.type.toLowerCase().includes(query)
    );

    setResults({ rooms: filteredRooms, devices: filteredDevices });
  }, [searchQuery]);

  const handleDeviceAction = (device) => {
    // Send OFF command as a baseline "action" for now
    fetch(`${gateway}/${device.id}/off`)
      .then(() => {
        handleClose();
      })
      .catch((err) => console.error('Search action failed:', err));
  };

  const handleRoomClick = (path) => {
    navigate(path);
    handleClose();
  };

  const getDeviceIcon = (type) => {
    switch(type) {
      case 'fan': return mdiFan;
      case 'geyser': return mdiWaterBoiler;
      case 'ac': return mdiAirConditioner;
      case 'tv': return mdiTelevision;
      default: return mdiLightbulbVariant;
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div style={{ width: '100%' }}>
        {!isOpen && (
          <IconButton onClick={handleOpen}>
            <Icon icon={searchFill} width={20} height={20} />
          </IconButton>
        )}

        <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
          <SearchbarStyle>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: { xs: APPBAR_MOBILE, md: APPBAR_DESKTOP } }}>
              <Input
                autoFocus
                fullWidth
                disableUnderline
                placeholder="Search rooms or devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Box
                      component={Icon}
                      icon={searchFill}
                      sx={{ color: 'text.disabled', width: 20, height: 20 }}
                    />
                  </InputAdornment>
                }
                sx={{ mr: 1, fontWeight: 'fontWeightBold', fontSize: '1.2rem' }}
              />
              <Button variant="contained" onClick={handleClose}>
                Close
              </Button>
            </Box>

            {(results.rooms.length > 0 || results.devices.length > 0) && (
              <ResultsWrapper elevation={0}>
                <List sx={{ p: 1 }}>
                  {results.rooms.length > 0 && (
                    <>
                      <Typography variant="overline" sx={{ px: 2, py: 1, color: 'text.secondary', display: 'block' }}>
                        Rooms
                      </Typography>
                      {results.rooms.map((room) => (
                        <ListItem 
                          button 
                          key={room.title} 
                          onClick={() => handleRoomClick(room.path)}
                          sx={{ borderRadius: 1, mb: 0.5 }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <IconM path={mdiOpenInNew} size={0.8} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={room.title} 
                            primaryTypographyProps={{ variant: 'subtitle2', sx: { textTransform: 'capitalize' } }} 
                          />
                        </ListItem>
                      ))}
                    </>
                  )}

                  {results.devices.length > 0 && (
                    <>
                      <Typography variant="overline" sx={{ px: 2, py: 1, mt: 1, color: 'text.secondary', display: 'block' }}>
                        Devices (Quick Toggle Off)
                      </Typography>
                      {results.devices.map((device) => (
                        <ListItem 
                          button 
                          key={device.id} 
                          onClick={() => handleDeviceAction(device)}
                          sx={{ 
                            borderRadius: 1, 
                            mb: 0.5,
                            '&:hover': {
                              bgcolor: alpha('#ff4842', 0.08),
                              '& .power-icon': { color: '#ff4842' }
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <IconM path={getDeviceIcon(device.type)} size={0.9} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={device.name} 
                            primaryTypographyProps={{ variant: 'subtitle2' }} 
                            secondary={device.type}
                            secondaryTypographyProps={{ variant: 'caption', sx: { opacity: 0.7 } }}
                          />
                          <IconM className="power-icon" path={mdiPower} size={0.8} color="rgba(0,0,0,0.3)" />
                        </ListItem>
                      ))}
                    </>
                  )}
                </List>
              </ResultsWrapper>
            )}
          </SearchbarStyle>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}

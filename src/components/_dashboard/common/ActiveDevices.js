import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Icon from '@mdi/react';
import { mdiFan, mdiWaterBoiler, mdiAirConditioner, mdiLightbulbVariant } from '@mdi/js';
import { decodeHtml } from '../../../utils/commons';

import { deviceMap, gateway } from '../../../constants/deviceMap';


const ActiveDevices = () => {
  const [activeDevices, setActiveDevices] = useState([]);

  const fetchDeviceStates = async () => {
    // Unique URLs to fetch
    const uniqueUrls = [...new Set(deviceMap.map(d => d.url))];
    const newActiveDevices = [];

    await Promise.all(
      uniqueUrls.map(async (url) => {
        try {
          const response = await fetch(`${gateway}${url}`);
          const rawData = await response.text();
          const parsedData = JSON.parse(decodeHtml(rawData));
          
          // Cross-reference data we received with our map
          const devicesOnThisBoard = deviceMap.filter(d => d.url === url);
          devicesOnThisBoard.forEach(device => {
            if (parsedData[device.key] && (parsedData[device.key].power === 'ON' || parsedData[device.key].power === 1)) {
              newActiveDevices.push(device);
            }
          });
        } catch (error) {
          console.error(`Failed to fetch status from ${url}:`, error);
        }
      })
    );

    setActiveDevices(newActiveDevices);
  };

  const handleToggleOff = (device) => {
    // Optimistic UI Update: Remove the device from the current list immediately
    setActiveDevices((prev) => prev.filter((d) => d.id !== device.id));

    // Send the turn-off command to the gateway
    fetch(`${gateway}/${device.id}/off`)
      .then((response) => response.json())
      .catch((error) => {
        console.error(`Failed to turn off ${device.name}:`, error);
        // On failure, the next polling cycle (8s) will naturally restore the chip if it's still ON
      });
  };

  useEffect(() => {
    fetchDeviceStates();
    // Use an 8 second polling interval due to the sheer volume of 15+ concurrent requests
    const intervalId = setInterval(fetchDeviceStates, 8000); 
    return () => clearInterval(intervalId);
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'fan': return <Icon path={mdiFan} size={1} className="fan-spin" color="inherit" />;
      case 'geyser': return <Icon path={mdiWaterBoiler} size={1} color="inherit" />;
      case 'ac': return <Icon path={mdiAirConditioner} size={1} color="inherit" />;
      default: return <Icon path={mdiLightbulbVariant} size={1} color="inherit" />;
    }
  };

  return (
    <Box sx={{ mb: 4, width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary', fontWeight: 'bold' }}>
        Active Appliances
      </Typography>
      
      {activeDevices.length === 0 ? (
         <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
           All tracked appliances are currently off.
         </Typography>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'action.disabledBackground', borderRadius: '4px' } }}>
          {activeDevices.map((device, index) => (
            <Card 
              key={index}
              onClick={() => handleToggleOff(device)}
              sx={{ 
                minWidth: 'auto',
                whiteSpace: 'nowrap',
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 1.5, 
                px: 2, 
                py: 1.25, 
                borderRadius: '16px', 
                bgcolor: 'primary.main', // Active state
                color: 'primary.contrastText', // Active text color
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.2)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px 0 rgba(0,0,0,0.3)'
                },
                '&:active': {
                  transform: 'scale(0.95)'
                }
              }}
            >
              {getIcon(device.type)}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'inherit' }}>
                {device.name}
              </Typography>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ActiveDevices;

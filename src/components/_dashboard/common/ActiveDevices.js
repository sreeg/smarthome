import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Icon from '@mdi/react';
import { mdiFan, mdiWaterBoiler, mdiAirConditioner, mdiLightbulbVariant } from '@mdi/js';
import { decodeHtml } from '../../../utils/commons';

const gateway = 'http://192.168.88.122:1880';

// Unified status map tracking ALL devices in the home
const deviceMap = [
  // FANS
  { id: 'mfan', name: 'Master Fan', type: 'fan', url: '/mboardtwostatus', key: '1' },
  { id: 'kfan', name: 'Kitchen Fan', type: 'fan', url: '/kboardtwostatus', key: '1' },
  { id: 'lfan', name: 'Living Fan', type: 'fan', url: '/lacboardstatus', key: '1' },
  { id: 'dfan', name: 'Drawing Fan', type: 'fan', url: '/dboardstatus', key: '1' },
  { id: 'ofan', name: 'Office Fan', type: 'fan', url: '/oboardtwostatus', key: '1' },
  
  // ACs
  { id: 'maczone', name: 'Master AC', type: 'ac', url: '/mboardmainstatus', key: '5' },
  { id: 'dinningaczone', name: 'Dining AC', type: 'ac', url: '/dinningboardstatus', key: '3' },
  { id: 'laczone', name: 'Living AC', type: 'ac', url: '/lboardmainstatus', key: '7' },
  { id: 'dtvzone', name: 'Drawing AC', type: 'ac', url: '/dboardmainstatus', key: '5' },

  // GEYSERS
  { id: 'mgyser', name: 'Master Geyser', type: 'geyser', url: '/mgyserstatus', key: '2' },
  { id: 'kgyser', name: 'Kitchen Geyser', type: 'geyser', url: '/kgyserstatus', key: '8' },
  { id: 'ogyser', name: 'Office Geyser', type: 'geyser', url: '/ogyserstatus', key: '2' },
  
  // LIVING ROOM LIGHTS
  { id: 'lcenterzone', name: 'Living Center', type: 'light', url: '/lboardmainstatus', key: '5' },
  { id: 'lhallway', name: 'Living Hallway', type: 'light', url: '/lboardmainstatus', key: '3' },
  { id: 'lcurtainlight', name: 'Living Curtain Light', type: 'light', url: '/lboardtwostatus', key: '1' },
  { id: 'lscallop', name: 'Living Scallop', type: 'light', url: '/lacboardstatus', key: '5' },
  { id: 'lfloorlamp', name: 'Living Floor Lamp', type: 'light', url: '/ltvboardstatus', key: '2' },
  { id: 'ltv', name: 'Living TV', type: 'tv', url: '/ltvboardstatus', key: '4' },
  
  // DRAWING ROOM LIGHTS
  { id: 'dcenterzone', name: 'Drawing Center', type: 'light', url: '/dboardmainstatus', key: '3' },
  { id: 'dhallway', name: 'Drawing Hallway', type: 'light', url: '/dboardmainstatus', key: '7' },
  { id: 'dgovee', name: 'Drawing Govee', type: 'light', url: '/dboardstatus', key: '2' },
  { id: 'dwalllamp', name: 'Drawing Wall Lamp', type: 'light', url: '/dboardstatus', key: '4' },
  { id: 'dcurtainlight', name: 'Drawing Curtain Light', type: 'light', url: '/dboardstatus', key: '5' },
  { id: 'dwallwasher', name: 'Drawing Wall Washer', type: 'light', url: '/dboardstatus', key: '6' },
  { id: 'dtv', name: 'Drawing TV', type: 'tv', url: '/dboardstatus', key: '8' },

  // MASTER BEDROOM LIGHTS
  { id: 'mcenterzone', name: 'Master Center', type: 'light', url: '/mboardmainstatus', key: '3' },
  { id: 'mwardrobe', name: 'Master Wardrobe', type: 'light', url: '/mboardmainstatus', key: '7' },
  { id: 'mlight2', name: 'Master Light 2', type: 'light', url: '/mboardtwostatus', key: '2' },
  { id: 'mlight3', name: 'Master Light 3', type: 'light', url: '/mboardtwostatus', key: '3' },
  { id: 'mlight4', name: 'Master Light 4', type: 'light', url: '/mboardtwostatus', key: '4' },
  { id: 'mwalllamp', name: 'Master Wall Lamp', type: 'light', url: '/mentrancestatus', key: '1' },
  { id: 'mtv', name: 'Master TV', type: 'tv', url: '/mtvboardstatus', key: '2' },
  { id: 'mtvunderlight', name: 'Master TV Light', type: 'light', url: '/mtvboardstatus', key: '3' },
  
  // KITCHEN LIGHTS
  { id: 'kicenterzone', name: 'Kitchen Center', type: 'light', url: '/kiboardmainstatus', key: '3' },
  { id: 'kiservicelight', name: 'Service Light', type: 'light', url: '/kiboardtwostatus', key: '2' },
  { id: 'kiwalllamp', name: 'Kitchen Wall Lamp', type: 'light', url: '/kiboardtwostatus', key: '3' },
  
  // BALCONY & POOJA
  { id: 'dinningcenterzone', name: 'Dining Center', type: 'light', url: '/dinningboardstatus', key: '5' },
  { id: 'poojaroom', name: 'Pooja Room', type: 'light', url: '/dinningboardstatus', key: '7' },
  { id: 'poojaroompanel', name: 'Pooja Panel', type: 'light', url: '/poojaboardstatus', key: '1' },
  { id: 'poojaroomunderlight', name: 'Pooja Underlight', type: 'light', url: '/poojaboardstatus', key: '2' },
  { id: 'dlight1', name: 'Dining Light 1', type: 'light', url: '/dinningboardtwostatus', key: '1' },
  { id: 'dlight2', name: 'Dining Light 2', type: 'light', url: '/dinningboardtwostatus', key: '2' },
  { id: 'dlight3', name: 'Dining Light 3', type: 'light', url: '/dinningboardtwostatus', key: '3' },
  { id: 'bchandlier', name: 'Balcony Chandelier', type: 'light', url: '/dinningboardtwostatus', key: '4' },
  { id: 'balconyzone', name: 'Balcony', type: 'light', url: '/bboardstatus', key: '3' },
  { id: 'bsocket', name: 'Balcony Socket', type: 'socket', url: '/bboardtwostatus', key: '1' },
  { id: 'bexhaust', name: 'Balcony Exhaust', type: 'fan', url: '/bboardtwostatus', key: '2' }
];

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
                transition: 'all 0.3s'
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

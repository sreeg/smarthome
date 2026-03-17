import React, { useState, useEffect } from 'react';
import { Box, Text, Paper, Group, Title, ScrollArea, rgba, useMantineTheme, UnstyledButton } from '@mantine/core';
import Icon from '@mdi/react';
import { mdiFan, mdiWaterBoiler, mdiAirConditioner, mdiLightbulbVariant } from '@mdi/js';
import { decodeHtml } from '../../../utils/commons';
import { deviceMap, gateway } from '../../../constants/deviceMap';

const ActiveDevices = () => {
  const theme = useMantineTheme();
  const [activeDevices, setActiveDevices] = useState([]);

  const fetchDeviceStates = async () => {
    const uniqueUrls = [...new Set(deviceMap.map(d => d.url))];
    const newActiveDevices = [];

    await Promise.all(
      uniqueUrls.map(async (url) => {
        try {
          const response = await fetch(`${gateway}${url}`);
          const rawData = await response.text();
          const parsedData = JSON.parse(decodeHtml(rawData));
          
          const devicesOnThisBoard = deviceMap.filter(d => d.url === url);
          devicesOnThisBoard.forEach(device => {
            const deviceData = device.key === 'state' ? parsedData : parsedData[device.key];
            if (deviceData) {
              const powerState = deviceData.power || deviceData.state || deviceData;
              if (powerState === 'ON' || powerState === 1 || powerState === 'true' || powerState === true) {
                newActiveDevices.push(device);
              }
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
    setActiveDevices((prev) => prev.filter((d) => d.id !== device.id));
    fetch(`${gateway}/${device.id}/off`)
      .then((response) => response.json())
      .catch((error) => console.error(`Failed to turn off ${device.name}:`, error));
  };

  useEffect(() => {
    fetchDeviceStates();
    const intervalId = setInterval(fetchDeviceStates, 8000); 
    return () => clearInterval(intervalId);
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'fan': return <Icon path={mdiFan} size={1} className="fan-spin" color="currentColor" />;
      case 'geyser': return <Icon path={mdiWaterBoiler} size={1} color="currentColor" />;
      case 'ac': return <Icon path={mdiAirConditioner} size={1} color="currentColor" />;
      default: return <Icon path={mdiLightbulbVariant} size={1} color="currentColor" />;
    }
  };

  return (
    <Box mb="xl">
      <Title order={6} mb="sm" c="dimmed" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Active Appliances
      </Title>
      
      {activeDevices.length === 0 ? (
         <Text size="sm" c="dimmed" fs="italic">
           All tracked appliances are currently off.
         </Text>
      ) : (
        <Group gap="xs" wrap="wrap">
          {activeDevices.map((device, index) => (
            <UnstyledButton
              key={index}
              onClick={() => handleToggleOff(device)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '100px',
                backgroundColor: 'var(--mantine-primary-color-filled)',
                color: 'var(--mantine-color-white)',
                boxShadow: theme.shadows.sm,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                flex: '0 0 auto',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  filter: 'brightness(1.1)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                }
              }}
            >
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                {getIcon(device.type)}
              </Box>
              <Text 
                size="xs" 
                fw={700}
                style={{ 
                  whiteSpace: 'nowrap',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {device.name}
              </Text>
            </UnstyledButton>
          ))}
        </Group>
      )}
    </Box>
  );
};

export default ActiveDevices;

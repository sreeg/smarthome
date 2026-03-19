import './switch.css';
import './zone.css';
import React from 'react';
import { 
  UnstyledButton, 
  Paper, 
  Text, 
  Stack, 
  rem,
  useMantineTheme,
  Box
} from '@mantine/core';
import { gateway } from '../../../constants/deviceMap';
import { addToRecents } from '../../../utils/recents';

const Zone = ({ sVal, zoneClass, sID, sName, stateHandler }) => {
  const theme = useMantineTheme();
  const isOn = sVal === 'ON';

  const handleToggle = () => {
    const newState = !isOn;
    const apiVal = newState ? 'on' : 'off';
    const stateVal = newState ? 'ON' : 'OFF';
    
    if (stateHandler) stateHandler(sID, stateVal);
    fetch(`${gateway}/${sID}/${apiVal}`).then((response) => response.json());
    addToRecents(sID);
  };

  const isZone33 = zoneClass.includes('zone33');

  return (
    <Paper 
      shadow="sm" 
      radius="lg" 
      withBorder 
      className={isOn ? 'switch-on' : 'switch-off'}
      style={{ 
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        border: isOn ? `1px solid var(--mantine-color-teal-filled)` : undefined
      }}
    >
      <UnstyledButton
        onClick={handleToggle}
        p="md"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: rem(8),
          backgroundColor: isOn ? 'var(--mantine-color-teal-light)' : 'transparent',
          color: isOn ? 'var(--mantine-color-teal-9)' : 'inherit',
        }}
      >
        <div className={'zone ' + zoneClass} style={{ color: 'currentColor' }}>
          {Array.from({ length: isZone33 ? 9 : 6 }).map((_, i) => (
            <span key={i}>
              <div></div>
            </span>
          ))}
        </div>
        <Stack gap={2} align="center">
          <Text size="xs" fw={700} tt="uppercase" ls="0.5px">
            {sName}
          </Text>
        </Stack>
      </UnstyledButton>
    </Paper>
  );
};

export default Zone;

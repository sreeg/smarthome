import React from 'react';
import { 
  UnstyledButton, 
  Paper, 
  Text, 
  Stack, 
  rem,
  useMantineTheme
} from '@mantine/core';
import { gateway } from '../../../constants/deviceMap';

const SwitchCustomIcon = ({ sVal, sID, sIcon, sName, stateHandler }) => {
  const isOn = sVal === 'ON';

  const handleToggle = () => {
    const newState = !isOn;
    const apiVal = newState ? 'on' : 'off';
    const stateVal = newState ? 'ON' : 'OFF';
    
    if (stateHandler) stateHandler(sID, stateVal);
    fetch(`${gateway}/${sID}/${apiVal}`).then((response) => response.json());
  };

  return (
    <Paper shadow="sm" radius="lg" withBorder style={{ 
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      border: isOn ? `1px solid var(--mantine-color-teal-filled)` : undefined
    }}>
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
        {React.createElement(sIcon, { size: 32, color: 'currentColor' })}
        <Stack gap={2} align="center">
          <Text size="xs" fw={700} tt="uppercase" ls="0.5px">
            {sName}
          </Text>
          <Text size="xs" c="dimmed" fw={500}>
            {isOn ? 'Active' : 'Off'}
          </Text>
        </Stack>
      </UnstyledButton>
    </Paper>
  );
};

export default SwitchCustomIcon;
import React, { useState } from 'react';
import { 
  Paper, 
  Text, 
  Group, 
  Stack, 
  ActionIcon, 
  Slider, 
  rem,
  useMantineTheme
} from '@mantine/core';
import Icon from '@mdi/react';
import { mdiCeilingFan } from '@mdi/js';
import { gateway } from '../../../constants/deviceMap';
import { addToRecents } from '../../../utils/recents';

const Fan = ({ sVal, sFval, sID, sIDFS, sName, stateHandler }) => {
  const theme = useMantineTheme();
  const [fanSpeed, setFanSpeed] = useState(sFval * 20 || 0);
  const [isOn, setIsOn] = useState(sVal === 'ON');

  const handleSpeedCommit = (v) => {
    fetch(`${gateway}/${sIDFS}/${v}`).then((response) => response.json());
    if (stateHandler) stateHandler(sIDFS, Math.round(v / 20));
    addToRecents(sID);
  };

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    const apiVal = newState ? 'ON' : 'OFF';
    fetch(`${gateway}/${sID}/${apiVal.toLowerCase()}`).then((response) => response.json());
    if (stateHandler) stateHandler(sID, apiVal);
    addToRecents(sID);
  };

  return (
    <Paper shadow="sm" radius="lg" p="md" withBorder style={{ 
      transition: 'all 0.3s ease',
      border: isOn ? `1px solid var(--mantine-color-teal-filled)` : undefined
    }}>
      <Group gap="lg" wrap="nowrap">
        <Stack align="center" gap={4} style={{ minWidth: rem(60) }}>
          <ActionIcon 
            variant={isOn ? 'filled' : 'light'} 
            color="teal" 
            size={54} 
            radius="xl"
            onClick={handleToggle}
            className={isOn ? 'fan-spin' : ''}
          >
            <Icon path={mdiCeilingFan} size={1.3} />
          </ActionIcon>
          <Text size="xs" fw={700} c="dimmed" style={{ textAlign: 'center' }}>
            {sName}
          </Text>
        </Stack>

        <Stack gap={4} style={{ flex: 1 }}>
          <Group justify="space-between">
            <Text size="xs" fw={600} c="dimmed">Speed</Text>
            <Text size="xs" fw={700}>{fanSpeed}%</Text>
          </Group>
          <Slider
            value={fanSpeed}
            onChange={setFanSpeed}
            onChangeEnd={handleSpeedCommit}
            min={0}
            max={100}
            step={20}
            color="teal"
            size="sm"
            label={null}
            styles={{
              thumb: { transition: 'transform 150ms ease' },
              track: { backgroundColor: 'var(--mantine-color-gray-2)' }
            }}
          />
        </Stack>
      </Group>
    </Paper>
  );
};

export default Fan;

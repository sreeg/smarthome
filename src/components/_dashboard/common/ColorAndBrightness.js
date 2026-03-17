import React, { useState } from 'react';
import { 
  Paper, 
  Text, 
  Group, 
  Stack, 
  Slider, 
  rem,
  useMantineTheme
} from '@mantine/core';
import { Icon } from '@iconify/react';
import sunFill from '@iconify/icons-eva/sun-fill';
import BulbOutline from '@iconify/icons-eva/bulb-outline';
import { gateway } from '../../../constants/deviceMap';

const ColorAndBrightness = ({ cDefaultValue, bDefaultValue, sColor, sBrightness, stateHandler }) => {
  const theme = useMantineTheme();
  const [colorVal, setColorVal] = useState(cDefaultValue * 20 || 0);
  const [brightVal, setBrightVal] = useState(bDefaultValue * 20 || 0);

  const handleColorCommit = (v) => {
    fetch(`${gateway}/${sColor}/${v}`).then((response) => response.json());
    if (stateHandler) stateHandler(sColor, Math.round(v / 20));
  };

  const handleBrightnessCommit = (v) => {
    fetch(`${gateway}/${sBrightness}/${v}`).then((response) => response.json());
    if (stateHandler) stateHandler(sBrightness, Math.round(v / 20));
  };

  return (
    <Paper shadow="sm" radius="lg" p="md" withBorder>
      <Stack gap="xl">
        {/* Brightness Section */}
        <Group gap="lg" wrap="nowrap">
          <Stack gap={0} style={{ minWidth: rem(60) }}>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase">Bright</Text>
            <Text size="sm" fw={700}>{brightVal}%</Text>
          </Stack>
          
          <Group gap="xs" style={{ flex: 1 }}>
            <Icon icon={sunFill} style={{ color: 'var(--mantine-color-gray-6)' }} width={16} />
            <Slider
              style={{ flex: 1 }}
              value={brightVal}
              onChange={setBrightVal}
              onChangeEnd={handleBrightnessCommit}
              min={0}
              max={100}
              label={null}
              color="yellow"
              styles={{
                track: { background: 'linear-gradient(90deg, #6b6b6b 0%, #ffe47a 100%)' },
                thumb: { border: `2px solid var(--mantine-color-yellow-6)` }
              }}
            />
            <Icon icon={sunFill} style={{ color: 'var(--mantine-color-yellow-4)' }} width={20} />
          </Group>
        </Group>

        {/* Temperature Section */}
        <Group gap="lg" wrap="nowrap">
          <Stack gap={0} style={{ minWidth: rem(60) }}>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase">Temp</Text>
            <Text size="sm" fw={700}>{colorVal}%</Text>
          </Stack>
          
          <Group gap="xs" style={{ flex: 1 }}>
            <Icon icon={BulbOutline} style={{ color: '#ff8b14' }} width={18} />
            <Slider
              style={{ flex: 1 }}
              value={colorVal}
              onChange={setColorVal}
              onChangeEnd={handleColorCommit}
              min={0}
              max={100}
              label={null}
              styles={{
                track: { background: 'linear-gradient(90deg, #ff8b14 0%, #ffffff 50%, #c4d1ff 100%)' },
                thumb: { border: `2px solid var(--mantine-color-gray-4)` }
              }}
            />
            <Icon icon={BulbOutline} style={{ color: '#c4d1ff' }} width={18} />
          </Group>
        </Group>
      </Stack>
    </Paper>
  );
};

export default ColorAndBrightness;

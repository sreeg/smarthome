import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Group, 
  ActionIcon, 
  Text, 
  rem,
  useMantineTheme
} from '@mantine/core';
import Icon from '@mdi/react';
import { mdiAirConditioner, mdiMinus, mdiPlus, mdiPower } from '@mdi/js';
import { gateway } from '../../../constants/deviceMap';

const AC = ({ sVal, sID, sName, stateHandler }) => {
  const [onoff, setOnoff] = useState(sVal === 'on' || sVal === 'ON' ? 'ON' : 'OFF');
  const [temp, setTemp] = useState(24);

  useEffect(() => {
    setOnoff(sVal === 'on' || sVal === 'ON' ? 'ON' : 'OFF');
  }, [sVal]);

  const handlePowerToggle = () => {
    const newVal = onoff === 'ON' ? 'OFF' : 'ON';
    setOnoff(newVal);
    if (stateHandler) stateHandler(sName, newVal);
    fetch(`${gateway}/${sName}/${newVal.toLowerCase()}`).then((response) => response.json());
  };

  const handleTempChange = (delta) => {
    let newTemp = temp + delta;
    if (newTemp > 26) newTemp = 26;
    if (newTemp < 18) newTemp = 18;
    
    setTemp(newTemp);
    fetch(`${gateway}/${sName}/${newTemp}`).then((response) => response.json());
  };

  const powerActive = onoff === 'ON';

  return (
    <Paper shadow="sm" radius="lg" p="md" withBorder style={{ display: 'inline-block' }}>
      <Group gap="xl" wrap="nowrap">
        <Icon path={mdiAirConditioner} size={1.5} color="var(--mantine-color-teal-6)" />

        <Group gap="md" wrap="nowrap">
          <ActionIcon 
            variant="light" 
            color="gray" 
            onClick={() => handleTempChange(-1)} 
            disabled={temp <= 18}
          >
            <Icon path={mdiMinus} size={0.8} />
          </ActionIcon>
          
          <Text size="lg" fw={800} style={{ minWidth: rem(40), textAlign: 'center' }}>
            {temp}°
          </Text>
          
          <ActionIcon 
            variant="light" 
            color="gray" 
            onClick={() => handleTempChange(1)} 
            disabled={temp >= 26}
          >
            <Icon path={mdiPlus} size={0.8} />
          </ActionIcon>
        </Group>

        <ActionIcon 
          size={48} 
          radius="xl" 
          variant={powerActive ? 'filled' : 'light'} 
          color="teal"
          onClick={handlePowerToggle}
        >
          <Icon path={mdiPower} size={1.2} />
        </ActionIcon>
      </Group>
    </Paper>
  );
};

export default AC;

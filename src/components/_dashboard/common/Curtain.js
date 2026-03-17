import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Group, 
  ActionIcon, 
  Text, 
  rem,
  useMantineTheme,
  Stack
} from '@mantine/core';
import Icon from '@mdi/react';
import { mdiCurtains, mdiCurtainsClosed, mdiPause } from '@mdi/js';
import { gateway } from '../../../constants/deviceMap';

const Curtain = ({ sVal, sID, sName, stateHandler }) => {
  const [alignment, setAlignment] = useState(sVal);

  useEffect(() => {
    setAlignment(sVal);
  }, [sVal]);

  const handleAction = (val) => {
    setAlignment(val);
    if (stateHandler) stateHandler(sID, val);
    fetch(`${gateway}/${sID}/${val}`).then((response) => response.json());
  };

  const getVariant = (val) => alignment === val ? 'filled' : 'light';

  return (
    <Paper shadow="sm" radius="lg" p="md" withBorder style={{ display: 'inline-block' }}>
      <Stack align="center" gap="sm">
        <Group gap="xs" wrap="nowrap">
          <ActionIcon 
            variant={getVariant('OPEN')} 
            color="teal" 
            size={48} 
            radius="xl" 
            onClick={() => handleAction('OPEN')}
          >
            <Icon path={mdiCurtains} size={1.2} />
          </ActionIcon>
          
          <ActionIcon 
            variant={getVariant('STOP')} 
            color="gray" 
            size={48} 
            radius="xl" 
            onClick={() => handleAction('STOP')}
          >
            <Icon path={mdiPause} size={1.2} />
          </ActionIcon>
          
          <ActionIcon 
            variant={getVariant('CLOSE')} 
            color="teal" 
            size={48} 
            radius="xl" 
            onClick={() => handleAction('CLOSE')}
          >
            <Icon path={mdiCurtainsClosed} size={1.2} />
          </ActionIcon>
        </Group>
        <Text size="xs" fw={700} tt="uppercase" ls="0.5px">{sName}</Text>
      </Stack>
    </Paper>
  );
};

export default Curtain;

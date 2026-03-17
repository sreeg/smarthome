import React, { useState, useEffect } from 'react';
import { Group, Text, Loader, Badge, rem } from '@mantine/core';
import Icon from '@mdi/react';
import { mdiDoorSlidingOpen, mdiDoorSliding } from '@mdi/js';
import { decodeHtml } from '../../../utils/commons';
import { gateway } from '../../../constants/deviceMap';

export default function DoorSensors({ room }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ contact: 'false', roomName: room });

  useEffect(() => {
    let endpoint = '/balconydoorsensor';
    if (room === 'Service balcony') {
      endpoint = '/servicebalconydoorsensor';
    }
    
    fetch(`${gateway}${endpoint}`)
      .then((response) => response.text())
      .then((rawData) => {
        const parsedData = JSON.parse(decodeHtml(rawData));
        setData({
          contact: parsedData.contact + '',
          roomName: room
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('DoorSensor fetch failed:', err);
        setLoading(false);
      });
  }, [room]);

  if (loading) return <Loader size="xs" color="teal" />;

  const isOpen = data.contact === 'false';

  return (
    <Group gap="xs" wrap="nowrap">
      <Text size="sm" fw={500} c="dimmed">{data.roomName}</Text>
      <Badge 
        variant="light" 
        color={isOpen ? 'red' : 'green'} 
        leftSection={<Icon path={isOpen ? mdiDoorSlidingOpen : mdiDoorSliding} size={0.7} color="currentColor" />}
        radius="sm"
      >
        {isOpen ? 'Open' : 'Closed'}
      </Badge>
    </Group>
  );
}

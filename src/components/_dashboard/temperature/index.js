import React, { useState, useEffect } from 'react';
import { Group, Text, Loader, rem } from '@mantine/core';
import Icon from '@mdi/react';
import { mdiThermometer, mdiWaterPercent } from '@mdi/js';
import { decodeHtml } from '../../../utils/commons';
import { gateway } from '../../../constants/deviceMap';

export default function Temperature({ room }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ temperature: 'OFF', humidity: 'OFF' });

  useEffect(() => {
    let endpoint = '/livingtemp';
    if (room === 'office') {
      endpoint = '/officetemp';
    }
    
    fetch(`${gateway}${endpoint}`)
      .then((response) => response.text())
      .then((rawData) => {
        const parsedData = JSON.parse(decodeHtml(rawData));
        setData({
          temperature: parsedData.temperature,
          humidity: parsedData.humidity
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Temperature fetch failed:', err);
        setLoading(false);
      });
  }, [room]);

  if (loading) return <Loader size="xs" color="teal" />;

  return (
    <Group gap="xs" wrap="nowrap">
      <Group gap={4} wrap="nowrap">
        <Icon path={mdiThermometer} size={0.8} color="var(--mantine-color-red-filled)" />
        <Text size="sm" fw={700}>{data.temperature}°C</Text>
      </Group>
      <Group gap={4} wrap="nowrap">
        <Icon path={mdiWaterPercent} size={0.8} color="var(--mantine-color-blue-filled)" />
        <Text size="sm" fw={700}>{data.humidity}%</Text>
      </Group>
    </Group>
  );
}

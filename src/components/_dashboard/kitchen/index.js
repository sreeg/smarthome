import React, { useState, useEffect } from 'react';
import { Grid, Stack, Loader, Text, Box } from '@mantine/core';
import Switch from '../common/Switch';
import Zone from '../common/Zone';
import { mdiCoachLamp, mdiStringLights } from '@mdi/js';
import { decodeHtml } from '../../../utils/commons';
import ColorAndBrightness from '../common/ColorAndBrightness';
import { gateway } from '../../../constants/deviceMap';

export default function KitchenRoom() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    kicenterzone: 'OFF',
    kiwalllamp: 'OFF',
    kiservicelight: 'OFF',
    kicolor: 5,
    kibrightness: 5
  });

  const stateHandler = (obj, val) => {
    setState(prev => ({ ...prev, [obj]: val }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          { url: '/kiboardmainstatus', mapping: (d) => ({ kibrightness: Math.round(d['1'].speed / 20), kicolor: Math.round(d['2'].speed / 20), kicenterzone: d['3'].power }) },
          { url: '/kiboardtwostatus', mapping: (d) => ({ kiservicelight: d['2'].power, kiwalllamp: d['3'].power }) }
        ];

        const results = await Promise.all(endpoints.map(e => fetch(`${gateway}${e.url}`).then(r => r.text())));
        
        let newState = { ...state };
        results.forEach((rawData, i) => {
          try {
            const parsed = JSON.parse(decodeHtml(rawData));
            newState = { ...newState, ...endpoints[i].mapping(parsed) };
          } catch(e) {}
        });

        setState(newState);
        setLoading(false);
      } catch (err) {
        console.error('Kitchen state fetch failed:', err);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <Stack align="center" py="xl">
      <Loader size="lg" color="teal" />
      <Text c="dimmed">Loading Kitchen...</Text>
    </Stack>
  );

  return (
    <Stack gap="xl" pb="xl">
      <Box>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Lighting</Text>
        <Grid gutter="md" align="center">
          <Grid.Col span={{ base: 12, md: 'auto' }}>
            <ColorAndBrightness 
              cDefaultValue={state.kicolor} 
              bDefaultValue={state.kibrightness} 
              sColor="kicolor" 
              sBrightness="kibrightness" 
              stateHandler={stateHandler} 
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
            <Zone sVal={state.kicenterzone} zoneClass="zone23 zone23center" sID="kicenterzone" sName="Center" stateHandler={stateHandler} />
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
            <Switch sVal={state.kiwalllamp} sID="kiwalllamp" sIcon={mdiCoachLamp} sName="Wall lamp" stateHandler={stateHandler} />
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
            <Switch sVal={state.kiservicelight} sID="kiservicelight" sIcon={mdiStringLights} sName="Service Balcony" stateHandler={stateHandler} />
          </Grid.Col>
        </Grid>
      </Box>
    </Stack>
  );
}

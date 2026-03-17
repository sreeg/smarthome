import React, { useState, useEffect } from 'react';
import { Grid, Stack, Loader, Text, Box, Paper, UnstyledButton, rem, Group, Title } from '@mantine/core';
import Switch from '../common/Switch';
import Curtain from '../common/Curtain';
import Zone from '../common/Zone';
import Fan from '../common/Fan';
import { mdiLedStripVariant, mdiCoachLamp, mdiWaterBoiler, mdiStringLights, mdiTelevision } from '@mdi/js';
import { decodeHtml } from '../../../utils/commons';
import AC from '../common/AC';
import ColorAndBrightness from '../common/ColorAndBrightness';
import { MdBedtime } from 'react-icons/md';
import { gateway } from '../../../constants/deviceMap';

export default function BedRoom() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    mfan: 'OFF',
    mlight2: 'OFF',
    mlight3: 'OFF',
    mlight4: 'OFF',
    mcenterzone: 'OFF',
    maczone: 'OFF',
    mwardrobe: 'OFF',
    mwalllamp: 'OFF',
    mtv: 'OFF',
    mtvunderlight: 'OFF',
    mfanspeed: 5,
    mcolor: 5,
    mbrightness: 5,
    mblackout: 'CLOSE',
    mgyser: 'OFF',
    temp: 24
  });

  const stateHandler = (obj, val) => {
    setState(prev => ({ ...prev, [obj]: val }));
  };

  const handleBedtime = () => {
    fetch(`${gateway}/bedtime/`).then((response) => response.json());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          { url: '/mgyserstatus', mapping: (d) => ({ mgyser: d['2'].power }) },
          { url: '/mentrancestatus', mapping: (d) => ({ mwalllamp: d['1'].power, mtvunderlight: d['2'].power }) },
          { url: '/mblackoutcurtainstatus', mapping: (d) => ({ mblackout: d['1'].curtain }) },
          { url: '/mboardmainstatus', mapping: (d) => ({ mbrightness: Math.round(d['1'].speed / 20), mcolor: Math.round(d['2'].speed / 20), maczone: d['5'].power, mcenterzone: d['3'].power, mwardrobe: d['7'].power }) },
          { url: '/mtvboardstatus', mapping: (d) => ({ mtv: d['2'].power, mtvunderlight: d['3'].power }) },
          { url: '/mboardtwostatus', mapping: (d) => ({ mfan: d['1'].power, mfanspeed: Math.round(d['1'].speed / 20), mlight2: d['2'].power, mlight3: d['3'].power, mlight4: d['4'].power }) }
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
        console.error('Bedroom state fetch failed:', err);
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
      <Text c="dimmed">Loading Bedroom...</Text>
    </Stack>
  );

  return (
    <Stack gap="xl" pb="xl">
      <Grid gutter="md" align="center">
        <Grid.Col span={{ base: 12, md: 'auto' }}>
          <ColorAndBrightness 
            cDefaultValue={state.mcolor} 
            bDefaultValue={state.mbrightness} 
            sColor="mcolor" 
            sBrightness="mbrightness" 
            stateHandler={stateHandler} 
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.maczone} zoneClass="zone23 zone23top" sID="maczone" sName="AC Zone" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.mcenterzone} zoneClass="zone23 zone23center" sID="mcenterzone" sName="Center" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.mwardrobe} zoneClass="zone23 zone23center" sID="mwardrobe" sName="Wardrobe" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Fan sVal={state.mfan} sFval={state.mfanspeed} sID="mfan" sIDFS="mfanspeed" sName="Fan" stateHandler={stateHandler} />
        </Grid.Col>
      </Grid>

      <Box>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Switches & Lighting</Text>
        <Grid gutter="md">
          {[
            { id: 'mwalllamp', name: 'Wall lamp', iconPath: mdiCoachLamp },
            { id: 'mtvunderlight', name: 'TV Underlight', iconPath: mdiLedStripVariant },
            { id: 'mtv', name: 'TV', iconPath: mdiTelevision },
            { id: 'mgyser', name: 'Geyser', iconPath: mdiWaterBoiler }
          ].map(sw => (
            <Grid.Col key={sw.id} span={{ base: 6, sm: 4, lg: 3 }}>
              <Switch sVal={state[sw.id]} sID={sw.id} sIcon={sw.iconPath} sName={sw.name} stateHandler={stateHandler} />
            </Grid.Col>
          ))}
          <Grid.Col span={{ base: 6, sm: 4, lg: 3 }}>
            <Paper shadow="sm" radius="lg" withBorder style={{ overflow: 'hidden' }}>
              <UnstyledButton
                onClick={handleBedtime}
                p="md"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: rem(8),
                  backgroundColor: 'var(--mantine-color-indigo-light)',
                  color: 'var(--mantine-color-indigo-9)',
                }}
              >
                <MdBedtime size={32} />
                <Text size="xs" fw={700} tt="uppercase">Bedtime</Text>
              </UnstyledButton>
            </Paper>
          </Grid.Col>
        </Grid>
      </Box>

      <Box>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Comfort</Text>
        <Group gap="md" align="flex-start">
          <Curtain sVal={state.mblackout} sID="mblackout" sName="Blackout" stateHandler={stateHandler} />
          <AC sVal={state.temp} sID="BAC" sName="BAC" stateHandler={stateHandler} />
        </Group>
      </Box>
    </Stack>
  );
}

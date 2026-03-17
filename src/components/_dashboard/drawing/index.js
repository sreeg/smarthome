import React, { useState, useEffect } from 'react';
import { Grid, Stack, Loader, Text, Box, Paper, UnstyledButton, rem, Group } from '@mantine/core';
import Switch from './../common/Switch';
import Zone from './../common/Zone';
import Fan from './../common/Fan';
import Curtain from './../common/Curtain';
import { 
  mdiMovieOpen, 
  mdiLedStripVariant, 
  mdiWallSconceFlat, 
  mdiTelevision, 
  mdiCoachLamp, 
  mdiVanityLight, 
  mdiStringLights 
} from '@mdi/js';
import Icon from '@mdi/react';
import { decodeHtml } from './../../../utils/commons';
import AC from './../common/AC';
import ColorAndBrightness from '../common/ColorAndBrightness';
import { gateway } from '../../../constants/deviceMap';

export default function DrawingRoom() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    dfan: 'OFF',
    dcurtainlight: 'OFF',
    dwallwasher: 'OFF',
    dgovee: 'OFF',
    dwalllamp: 'OFF',
    dtv: 'OFF',
    dcenterzone: 'OFF',
    dhallway: 'OFF',
    dtvzone: 'OFF',
    dfanspeed: 5,
    dcolor: 5,
    dbrightness: 5,
    dsheer: 'CLOSE',
    dblackout: 'CLOSE',
    temp: 24
  });

  const stateHandler = (obj, val) => {
    setState(prev => ({ ...prev, [obj]: val }));
  };

  const handleMovieMode = () => {
    fetch(`${gateway}/movietime/`).then((response) => response.json());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          { url: '/dsheercurtainstatus', mapping: (d) => ({ dsheer: d['1'].curtain }) },
          { url: '/dblackoutcurtainstatus', mapping: (d) => ({ dblackout: d['1'].curtain }) },
          { url: '/dboardmainstatus', mapping: (d) => ({ dbrightness: Math.round(d['1'].speed / 20), dcolor: Math.round(d['2'].speed / 20), dcenterzone: d['3'].power, dtvzone: d['5'].power, dhallway: d['7'].power }) },
          { url: '/dboardstatus', mapping: (d) => ({ dfan: d['1'].power, dfanspeed: Math.round(d['1'].speed / 20), dgovee: d['2'].power, dwalllamp: d['4'].power, dcurtainlight: d['5'].power, dwallwasher: d['6'].power, dtv: d['8'].power }) }
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
        console.error('Drawing state fetch failed:', err);
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
      <Text c="dimmed">Loading Drawing Room...</Text>
    </Stack>
  );

  return (
    <Stack gap="xl" pb="xl">
      <Grid gutter="md" align="center">
        <Grid.Col span={{ base: 12, md: 'auto' }}>
          <ColorAndBrightness 
            cDefaultValue={state.dcolor} 
            bDefaultValue={state.dbrightness} 
            sColor="dcolor" 
            sBrightness="dbrightness" 
            stateHandler={stateHandler} 
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.dcenterzone} zoneClass="zone33 zone33center" sID="dcenterzone" sName="Center" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.dtvzone} zoneClass="zone33 zone33ac" sID="dtvzone" sName="TV Zone" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.dhallway} zoneClass="zone33 zone33left" sID="dhallway" sName="Hallway" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Fan sVal={state.dfan} sFval={state.dfanspeed} sID="dfan" sIDFS="dfanspeed" sName="Fan" stateHandler={stateHandler} />
        </Grid.Col>
      </Grid>

      <Box>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Switches & Lighting</Text>
        <Grid gutter="md">
          {[
            { id: 'dwalllamp', name: 'Wall lamp', iconPath: mdiCoachLamp },
            { id: 'dcurtainlight', name: 'Curtain Light', iconPath: mdiVanityLight },
            { id: 'dwallwasher', name: 'Wall Washer', iconPath: mdiWallSconceFlat },
            { id: 'dgovee', name: 'Govee', iconPath: mdiLedStripVariant },
            { id: 'dtv', name: 'TV', iconPath: mdiTelevision }
          ].map(sw => (
            <Grid.Col key={sw.id} span={{ base: 6, sm: 4, lg: 2.4 }}>
              <Switch sVal={state[sw.id]} sID={sw.id} sIcon={sw.iconPath} sName={sw.name} stateHandler={stateHandler} />
            </Grid.Col>
          ))}
          <Grid.Col span={{ base: 6, sm: 4, lg: 2.4 }}>
            <Paper shadow="sm" radius="lg" withBorder style={{ overflow: 'hidden' }}>
              <UnstyledButton
                onClick={handleMovieMode}
                p="md"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: rem(8),
                  backgroundColor: 'var(--mantine-color-orange-light)',
                  color: 'var(--mantine-color-orange-9)',
                }}
              >
                <Icon path={mdiMovieOpen} size={1.3} />
                <Text size="xs" fw={700} tt="uppercase">Movie Mode</Text>
              </UnstyledButton>
            </Paper>
          </Grid.Col>
        </Grid>
      </Box>

      <Box>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Comfort</Text>
        <Group gap="md" align="flex-start">
          <Curtain sVal={state.dsheer} sID="dsheer" sName="Sheer" stateHandler={stateHandler} />
          <Curtain sVal={state.dblackout} sID="dblackout" sName="Blackout" stateHandler={stateHandler} />
          <AC sVal={state.temp} sID="DAC" sName="DAC" stateHandler={stateHandler} />
        </Group>
      </Box>
    </Stack>
  );
}

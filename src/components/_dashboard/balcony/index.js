import React, { useState, useEffect } from 'react';
import { Grid, Stack, Loader, Text, Box, Paper, UnstyledButton, rem, Group, SimpleGrid } from '@mantine/core';
import Switch from '../common/Switch';
import SwitchCustomIcon from '../common/SwitchCustomIcon';
import Zone from '../common/Zone';
import Curtain from '../common/Curtain';
import { mdiStringLights, mdiChandelier, mdiOm, mdiHandsPray, mdiPipeValve } from '@mdi/js';
import { decodeHtml } from '../../../utils/commons';
import { GiByzantinTemple, GiElectricalSocket, GiCandleFlame } from 'react-icons/gi';
import { FaFan } from 'react-icons/fa';
import { MdBalcony } from 'react-icons/md';
import ColorAndBrightness from '../common/ColorAndBrightness';
import { gateway } from '../../../constants/deviceMap';

export default function BalconyRoom() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    bchandlier: 'OFF',
    poojaroompanel: 'OFF',
    poojaomlight: 'OFF',
    dlight1: 'OFF',
    dlight2: 'OFF',
    dinningcenterzone: 'OFF',
    dinningaczone: 'OFF',
    poojaroom: 'OFF',
    poojaroomunderlight: 'OFF',
    bcolor: 5,
    bbrightness: 5,
    bsheer: 'CLOSE',
    bblackout: 'CLOSE',
    balconyzone: 'OFF',
    bsocket: 'OFF',
    bexhaust: 'OFF',
    bvalve: 'OFF'
  });

  const stateHandler = (obj, val) => {
    setState(prev => ({ ...prev, [obj]: val }));
  };

  const handleCozyMode = () => {
    fetch(`${gateway}/dinningcozy/`).then((response) => response.json());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          { url: '/bboardstatus', mapping: (d) => ({ balconyzone: d['3'].power }) },
          { url: '/bboardtwostatus', mapping: (d) => ({ bsocket: d['1'].power, bexhaust: d['2'].power }) },
          { url: '/bsheercurtainstatus', mapping: (d) => ({ bsheer: d['1'].curtain }) },
          { url: '/bblackoutcurtainstatus', mapping: (d) => ({ bblackout: d['1'].curtain }) },
          { url: '/dinningboardstatus', mapping: (d) => ({ bbrightness: Math.round(d['1'].speed / 20), bcolor: Math.round(d['2'].speed / 20), dinningcenterzone: d['5'].power, poojaroom: d['7'].power, dinningaczone: d['3'].power }) },
          { url: '/poojaboardstatus', mapping: (d) => ({ poojaroompanel: d['1'].power, poojaroomunderlight: d['2'].power }) },
          { url: '/dinningboardtwostatus', mapping: (d) => ({ dlight1: d['1'].power, dlight2: d['2'].power, bchandlier: d['4'].power, dlight3: d['3'].power }) },
          { url: '/watervalvestatus', mapping: (d) => ({ bvalve: d.state || 'OFF' }) }
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
        console.error('Balcony state fetch failed:', err);
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
      <Text c="dimmed">Loading Balcony & Dining...</Text>
    </Stack>
  );

  return (
    <Stack gap="xl" pb="xl">
      <Grid gutter="md" align="center">
        <Grid.Col span={{ base: 12, md: 'auto' }}>
          <ColorAndBrightness 
            cDefaultValue={state.bcolor} 
            bDefaultValue={state.bbrightness} 
            sColor="bcolor" 
            sBrightness="bbrightness" 
            stateHandler={stateHandler} 
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.dinningaczone} zoneClass="zone33 zone33left" sID="dinningaczone" sName="AC" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.dinningcenterzone} zoneClass="zone33 zone33center" sID="dinningcenterzone" sName="Center" stateHandler={stateHandler} />
        </Grid.Col>
      </Grid>

      <Box>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Dining & Pooja</Text>
        <Grid gutter="md">
          {[
            { id: 'poojaroom', name: 'Pooja', iconPath: mdiHandsPray },
            { id: 'bchandlier', name: 'Chandlier', iconPath: mdiChandelier },
            { id: 'poojaroompanel', name: 'Panel', icon: GiByzantinTemple },
            { id: 'poojaroomunderlight', name: 'Underlight', iconPath: mdiChandelier },
            { id: 'poojaomlight', name: 'Om Light', iconPath: mdiOm }
          ].map(sw => (
            <Grid.Col key={sw.id} span={{ base: 6, sm: 4, lg: 2.4 }}>
              {sw.iconPath ? (
                <Switch sVal={state[sw.id]} sID={sw.id} sIcon={sw.iconPath} sName={sw.name} stateHandler={stateHandler} />
              ) : (
                <SwitchCustomIcon sVal={state[sw.id]} sID={sw.id} sIcon={sw.icon} sName={sw.name} stateHandler={stateHandler} />
              )}
            </Grid.Col>
          ))}
        </Grid>
      </Box>

      <Box>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Balcony & Utility</Text>
        <Grid gutter="md">
          {[
            { id: 'balconyzone', name: 'Balcony', icon: MdBalcony },
            { id: 'bsocket', name: 'Balcony Socket', icon: GiElectricalSocket },
            { id: 'bexhaust', name: 'Exhaust Fan', icon: FaFan },
            { id: 'bvalve', name: 'Water Valve', iconPath: mdiPipeValve }
          ].map(sw => (
            <Grid.Col key={sw.id} span={{ base: 6, sm: 4, lg: 3 }}>
              {sw.iconPath ? (
                <Switch sVal={state[sw.id]} sID={sw.id} sIcon={sw.iconPath} sName={sw.name} stateHandler={stateHandler} />
              ) : (
                <SwitchCustomIcon sVal={state[sw.id]} sID={sw.id} sIcon={sw.icon} sName={sw.name} stateHandler={stateHandler} />
              )}
            </Grid.Col>
          ))}
          <Grid.Col span={{ base: 6, sm: 4, lg: 3 }}>
            <Paper shadow="sm" radius="lg" withBorder style={{ overflow: 'hidden' }}>
              <UnstyledButton
                onClick={handleCozyMode}
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
                <GiCandleFlame size={32} />
                <Text size="xs" fw={700} tt="uppercase">Cozy Mode</Text>
              </UnstyledButton>
            </Paper>
          </Grid.Col>
        </Grid>
      </Box>

      <Box>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Window Controls</Text>
        <Group gap="md">
          <Curtain sVal={state.bsheer} sID="bsheer" sName="Sheer" stateHandler={stateHandler} />
          <Curtain sVal={state.bblackout} sID="bblackout" sName="Blackout" stateHandler={stateHandler} />
        </Group>
      </Box>
    </Stack>
  );
}

import React, { useState, useEffect } from 'react';
import { Grid, Stack, Loader, Text, Box, Group } from '@mantine/core';
import Switch from '../common/Switch';
import SwitchCustomIcon from '../common/SwitchCustomIcon';
import Curtain from '../common/Curtain';
import Zone from '../common/Zone';
import Fan from '../common/Fan';
import { mdiLamp, mdiCoachLamp, mdiWaterBoiler, mdiStringLights } from '@mdi/js';
import { GiElectricalSocket } from 'react-icons/gi';
import { decodeHtml } from '../../../utils/commons';
import ColorAndBrightness from '../common/ColorAndBrightness';
import { gateway } from '../../../constants/deviceMap';

export default function KidsRoom() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    kfan: 'OFF',
    kcenterzone: 'OFF',
    kaczone: 'OFF',
    kwardrobe: 'OFF',
    kwalllamp: 'OFF',
    klight2: 'OFF',
    klight4: 'OFF',
    kfanspeed: 5,
    kcolor: 5,
    kbrightness: 5,
    kblackout: 'CLOSE',
    kgyser: 'OFF',
    ktablelamp: 'OFF',
    ksocket1: 'OFF',
    ksocketwardrobe: 'OFF'
  });

  const stateHandler = (obj, val) => {
    setState(prev => ({ ...prev, [obj]: val }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          { url: '/kgyserstatus', mapping: (d) => ({ ksocketwardrobe: d['7'].power, kgyser: d['8'].power }) },
          { url: '/kblackoutcurtainstatus', mapping: (d) => ({ kblackout: d['1'].curtain }) },
          { url: '/ksbstatus', mapping: (d) => ({ kwalllamp: d['1'].power, ksocket1: d['2'].power }) },
          { url: '/kboardmainstatus', mapping: (d) => ({ kbrightness: Math.round(d['1'].speed / 20), kcolor: Math.round(d['2'].speed / 20), kaczone: d['5'].power, kcenterzone: d['3'].power, kwardrobe: d['7'].power }) },
          { url: '/kboardtwostatus', mapping: (d) => ({ kfan: d['1'].power, kfanspeed: Math.round(d['1'].speed / 20), klight2: d['2'].power, kwalllamp: d['3'].power, klight4: d['4'].power }) }
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
        console.error('Kids state fetch failed:', err);
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
      <Text c="dimmed">Loading Kids Room...</Text>
    </Stack>
  );

  return (
    <Stack gap="xl" pb="xl">
      <Grid gutter="md" align="center">
        <Grid.Col span={{ base: 12, md: 'auto' }}>
          <ColorAndBrightness 
            cDefaultValue={state.kcolor} 
            bDefaultValue={state.kbrightness} 
            sColor="kcolor" 
            sBrightness="kbrightness" 
            stateHandler={stateHandler} 
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.kaczone} zoneClass="zone23 zone23top" sID="kaczone" sName="AC" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.kcenterzone} zoneClass="zone23 zone23center" sID="kcenterzone" sName="Center" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.kwardrobe} zoneClass="zone23 zone23center" sID="kwardrobe" sName="Wardrobe" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Fan sVal={state.kfan} sFval={state.kfanspeed} sID="kfan" sIDFS="kfanspeed" sName="Fan" stateHandler={stateHandler} />
        </Grid.Col>
      </Grid>

      <Box>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Switches & Lighting</Text>
        <Grid gutter="md">
          {[
            { id: 'kwalllamp', name: 'Wall lamp', iconPath: mdiCoachLamp },
            { id: 'kgyser', name: 'Geyser', iconPath: mdiWaterBoiler },
            { id: 'ktablelamp', name: 'Table Lamp', iconPath: mdiLamp },
            { id: 'ksocket1', name: 'Socket 1', icon: GiElectricalSocket },
            { id: 'ksocketwardrobe', name: 'Wardrobe Socket', icon: GiElectricalSocket }
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
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Comfort</Text>
        <Group gap="md">
          <Curtain sVal={state.kblackout} sID="kblackout" sName="Blackout" stateHandler={stateHandler} />
        </Group>
      </Box>
    </Stack>
  );
}

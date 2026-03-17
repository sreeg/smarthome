import React, { useState, useEffect } from 'react';
import { Grid, Stack, Loader, Text, Box, Group } from '@mantine/core';
import Switch from '../common/Switch';
import ColorAndBrightness from '../common/ColorAndBrightness';
import SwitchCustomIcon from '../common/SwitchCustomIcon';
import Zone from '../common/Zone';
import Curtain from '../common/Curtain';
import Fan from '../common/Fan';
import { mdiTelevision, mdiEiffelTower } from '@mdi/js';
import { decodeHtml } from '../../../utils/commons';
import { GiDoubleStreetLights, GiCeilingLight, GiTheaterCurtains, GiScallop, GiDjedPillar } from 'react-icons/gi';
import AC from '../common/AC';
import { gateway } from '../../../constants/deviceMap';

export default function Living() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    lcolor: 5,
    lbrightness: 5,
    lsheer: 'CLOSE',
    lblackout: 'CLOSE',
    lcenterzone: 'OFF',
    lhallway: 'OFF',
    laczone: 'OFF',
    lfloorlamp: 'OFF',
    ltv: 'OFF',
    ldigitalclock: 'OFF',
    lcurtainlight: 'OFF',
    lscallop: 'OFF',
    lfanspeed: 5,
    lfan: 'OFF',
    livingtvsocket: 'OFF',
    lfloorikea: 'OFF',
    lAC: 'OFF',
    temp: 24
  });

  const stateHandler = (obj, val) => {
    setState(prev => ({ ...prev, [obj]: val }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          { url: '/lsheercurtainstatus', mapping: (d) => ({ lsheer: d['1'].curtain }) },
          { url: '/lblackoutcurtainstatus', mapping: (d) => ({ lblackout: d['1'].curtain }) },
          { url: '/ltvboardstatus', mapping: (d) => ({ ltv: d['4'].power, ldigitalclock: d['3'].power, lfloorlamp: d['2'].power, livingtvsocket: d['1'].power }) },
          { url: '/lacboardstatus', mapping: (d) => ({ lfanspeed: Math.round(d['1'].speed / 20), lfan: d['1'].power, lscallop: d['5'].power }) },
          { url: '/lboardtwostatus', mapping: (d) => ({ lcurtainlight: d['1'].power }) },
          { url: '/lboardmainstatus', mapping: (d) => ({ lbrightness: Math.round(d['1'].speed / 20), lcolor: Math.round(d['2'].speed / 20), lcenterzone: d['5'].power, lhallway: d['3'].power, laczone: d['7'].power }) }
        ];

        const results = await Promise.all(endpoints.map(e => fetch(`${gateway}${e.url}`).then(r => r.text())));
        
        let newState = { ...state };
        results.forEach((rawData, i) => {
          const parsed = JSON.parse(decodeHtml(rawData));
          newState = { ...newState, ...endpoints[i].mapping(parsed) };
        });

        setState(newState);
        setLoading(false);
      } catch (err) {
        console.error('Living state fetch failed:', err);
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
      <Text c="dimmed">Loading Living Room...</Text>
    </Stack>
  );

  return (
    <Stack gap="xl" pb="xl">
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 'auto' }}>
          <ColorAndBrightness 
            cDefaultValue={state.lcolor} 
            bDefaultValue={state.lbrightness} 
            sColor="lcolor" 
            sBrightness="lbrightness" 
            stateHandler={stateHandler} 
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.laczone} zoneClass="zone33 zone33ac" sID="laczone" sName="AC" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.lcenterzone} zoneClass="zone33 zone33center" sID="lcenterzone" sName="Center" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.lhallway} zoneClass="zone33 zone33left" sID="lhallway" sName="Hallway" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Fan sVal={state.lfan} sFval={state.lfanspeed} sID="lfan" sIDFS="lfanspeed" sName="Fan" stateHandler={stateHandler} />
        </Grid.Col>
      </Grid>

      <Box>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Switches</Text>
        <Grid gutter="md">
          {[
            { id: 'lscallop', name: 'Scallop', icon: GiScallop },
            { id: 'lcurtainlight', name: 'Curtain light', icon: GiTheaterCurtains },
            { id: 'ldigitalclock', name: 'Eiffel Tower', iconPath: mdiEiffelTower },
            { id: 'ltv', name: 'Frame TV', iconPath: mdiTelevision },
            { id: 'lfloorlamp', name: 'Floor lamp', icon: GiDjedPillar },
            { id: 'livingtvsocket', name: 'Cabnet', icon: GiCeilingLight },
            { id: 'lfloorikea', name: 'Ikea Floor', icon: GiDoubleStreetLights }
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
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Curtains</Text>
        <Group gap="md">
          <Curtain sVal={state.lsheer} sID="lsheer" sName="Sheer" stateHandler={stateHandler} />
          <Curtain sVal={state.lblackout} sID="lblackout" sName="Blackout" stateHandler={stateHandler} />
        </Group>
      </Box>

      <Box>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Air Conditioning</Text>
        <AC sVal={state.temp} sID="lAC" sName="lAC" stateHandler={stateHandler} />
      </Box>
    </Stack>
  );
}

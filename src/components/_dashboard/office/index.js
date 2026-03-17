import React, { useState, useEffect, useMemo } from 'react';
import * as _ from 'underscore';
import { 
  Grid, 
  Stack, 
  Loader, 
  Text, 
  Box, 
  Paper, 
  ActionIcon, 
  rem, 
  Group, 
  Modal, 
  Select, 
  Slider,
  Title
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Switch from '../common/Switch';
import SwitchCustomIcon from '../common/SwitchCustomIcon';
import Curtain from '../common/Curtain';
import Zone from '../common/Zone';
import Fan from '../common/Fan';
import { 
  mdiLightbulbVariantOutline, 
  mdiWaterBoiler, 
  mdiStringLights, 
  mdiLedStripVariant, 
  mdiAirConditioner, 
  mdiVanityLight, 
  mdiCellphoneDock 
} from '@mdi/js';
import { decodeHtml } from './../../../utils/commons';
import { FaPagelines } from 'react-icons/fa';
import { HexColorPicker } from 'react-colorful';
import ColorAndBrightness from '../common/ColorAndBrightness';
import Temperature from '../temperature';
import { IconSettings } from '@tabler/icons-react';
import { gateway } from '../../../constants/deviceMap';

export default function OfficeRoom() {
  const [loading, setLoading] = useState(true);
  const [openedNano, { open: openNano, close: closeNano }] = useDisclosure(false);
  const [openedCurtain, { open: openCurtain, close: closeCurtain }] = useDisclosure(false);
  
  const [state, setState] = useState({
    ofan: 'OFF',
    lines: 'OFF',
    olight3: 'OFF',
    olight4: 'OFF',
    olight5: 'OFF',
    olight6: 'OFF',
    olight7: 'OFF',
    olight8: 'OFF',
    ocenterzone: 'OFF',
    oaczone: 'OFF',
    owindowside: 'OFF',
    oac: 'OFF',
    oled: 'OFF',
    ofanspeed: 5,
    ocolor: 5,
    obrightness: 5,
    linesbrightness: 5,
    curtainbrightness: 5,
    osheer: 'CLOSE',
    oblackout: 'CLOSE',
    ogyser: 'OFF',
    color: '#FFFFFF',
    curtaincolor: '#FFFFFF',
    serotv: 'OFF',
    effects: [],
    selectedEffect: '',
    selectedCurtainEffect: 'off'
  });

  const stateHandler = (obj, val) => {
    setState(prev => ({ ...prev, [obj]: val }));
  };

  const handleLinesColor = (color) => {
    stateHandler('color', color);
    fetch(`${gateway}/linescolor/${color.substring(1)}`).then(r => r.json());
  };

  const throttledLinesColor = useMemo(() => _.throttle(handleLinesColor, 1000), []);

  const handleCurtainColor = (color) => {
    stateHandler('curtaincolor', color);
    fetch(`${gateway}/curtaincolor/${color.substring(1)}`).then(r => r.json());
  };

  const throttledCurtainColor = useMemo(() => _.throttle(handleCurtainColor, 1000), []);

  useEffect(() => {
    const fetchData = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const endpoints = [
          { url: '/osheercurtainstatus', mapping: (d) => ({ osheer: d['1'].curtain }) },
          { url: '/ogyserstatus', mapping: (d) => ({ ogyser: d['2'].power }) },
          { url: '/oblackoutcurtainstatus', mapping: (d) => ({ oblackout: d['1'].curtain }) },
          { url: '/getlineseffects', mapping: (d) => ({ selectedEffect: d['selected'], effects: d['available'] }) },
          { url: '/oboardmainstatus', mapping: (d) => ({ obrightness: Math.round(d['1'].speed / 20), ocolor: Math.round(d['2'].speed / 20), ocenterzone: d['5'].power, owindowside: d['7'].power, oaczone: d['3'].power }) },
          { url: '/oboardtwostatus', mapping: (d) => ({ ofan: d['1'].power, ofanspeed: Math.round(d['1'].speed / 20), lines: d['2'].power, olight3: d['3'].power, olight4: d['4'].power, olight5: d['5'].power, olight6: d['6'].power, olight7: d['7'].power, olight8: d['8'].power }) }
        ];

        const results = await Promise.all(
          endpoints.map(e => 
            fetch(`${gateway}${e.url}`, { signal: controller.signal })
              .then(r => r.text())
              .catch(() => '{}')
          )
        );

        clearTimeout(timeoutId);
        
        let newState = { ...state };
        results.forEach((rawData, i) => {
          try {
            const parsed = JSON.parse(decodeHtml(rawData));
            newState = { ...newState, ...endpoints[i].mapping(parsed) };
          } catch(e) {}
        });

        setState(newState);
      } catch (err) {
        console.error('Office state fetch failed:', err);
      } finally {
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
      <Text c="dimmed">Loading Office...</Text>
    </Stack>
  );

  return (
    <Stack gap="xl" pb="xl">
      <Paper p="md" radius="lg" shadow="sm" withBorder>
        <Temperature room="office" />
      </Paper>

      <Grid gutter="md" align="center">
        <Grid.Col span={{ base: 12, md: 'auto' }}>
          <ColorAndBrightness 
            cDefaultValue={state.ocolor} 
            bDefaultValue={state.obrightness} 
            sColor="ocolor" 
            sBrightness="obrightness" 
            stateHandler={stateHandler} 
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.oaczone} zoneClass="zone23 zone23top" sName="AC" sID="oaczone" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.ocenterzone} zoneClass="zone23 zone23center" sName="Center" sID="ocenterzone" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Zone sVal={state.owindowside} zoneClass="zone23 zone23bottom" sName="Window" sID="owindowside" stateHandler={stateHandler} />
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 4, md: 'content' }}>
          <Fan sVal={state.ofan} sFval={state.ofanspeed} sID="ofan" sIDFS="ofanspeed" sName="Fan" stateHandler={stateHandler} />
        </Grid.Col>
      </Grid>

      <Box>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Smart Lighting</Text>
        <Grid gutter="md">
           <Grid.Col span={{ base: 6, sm: 4, lg: 3 }}>
              <Group gap={0} wrap="nowrap">
                <Box style={{ flex: 1 }}>
                  <SwitchCustomIcon sVal={state.lines} sID="lines" sIcon={FaPagelines} sName="Nano Lines" stateHandler={stateHandler} />
                </Box>
                <ActionIcon variant="light" color="teal" size={54} radius="md" onClick={openNano} ml="xs">
                  <IconSettings size="1.2rem" />
                </ActionIcon>
              </Group>
           </Grid.Col>

           <Grid.Col span={{ base: 6, sm: 4, lg: 3 }}>
              <Group gap={0} wrap="nowrap">
                <Box style={{ flex: 1 }}>
                  <Switch sVal={state.olight6} sID="olight6" sIcon={mdiVanityLight} sName="Curtain Light" stateHandler={stateHandler} />
                </Box>
                <ActionIcon variant="light" color="teal" size={54} radius="md" onClick={openCurtain} ml="xs">
                  <IconSettings size="1.2rem" />
                </ActionIcon>
              </Group>
           </Grid.Col>

           {[
             { id: 'olight7', name: 'WD Warm', iconPath: mdiLightbulbVariantOutline },
             { id: 'olight8', name: 'WD Color', iconPath: mdiLightbulbVariantOutline },
             { id: 'ogyser', name: 'Geyser', iconPath: mdiWaterBoiler },
             { id: 'serotv', name: 'Sero TV', iconPath: mdiCellphoneDock },
             { id: 'oled', name: 'LED Strip', iconPath: mdiLedStripVariant },
             { id: 'oac', name: 'AC Power', iconPath: mdiAirConditioner }
           ].map(sw => (
             <Grid.Col key={sw.id} span={{ base: 6, sm: 4, lg: 3 }}>
               <Switch sVal={state[sw.id]} sID={sw.id} sIcon={sw.iconPath} sName={sw.name} stateHandler={stateHandler} />
             </Grid.Col>
           ))}
        </Grid>
      </Box>

      <Box>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Window Controls</Text>
        <Group gap="md">
          <Curtain sVal={state.osheer} sID="osheer" sName="Sheer" stateHandler={stateHandler} />
          <Curtain sVal={state.oblackout} sID="oblackout" sName="Blackout" stateHandler={stateHandler} />
        </Group>
      </Box>

      {/* Nano Line Settings Modal */}
      <Modal opened={openedNano} onClose={closeNano} title="Nano Lines Settings" radius="md">
        <Stack gap="md">
          <Select 
            label="Scene" 
            placeholder="Select effect" 
            data={state.effects} 
            value={state.selectedEffect} 
            onChange={(v) => { stateHandler('selectedEffect', v); fetch(`${gateway}/lineseffect/${v}`).then(r => r.json()); }}
          />
          <Box>
            <Text size="sm" mb={4}>Brightness</Text>
            <Slider 
              min={1} max={5} step={1} 
              value={state.linesbrightness} 
              onChange={(v) => stateHandler('linesbrightness', v)} 
              onChangeEnd={(v) => fetch(`${gateway}/linesbrightness/${v*20}`).then(r => r.json())}
            />
          </Box>
          <Box align="center">
            <Text size="sm" mb={4}>Color</Text>
            <HexColorPicker color={state.color} onChange={throttledLinesColor} />
          </Box>
        </Stack>
      </Modal>

      {/* Curtain light Settings Modal */}
      <Modal opened={openedCurtain} onClose={closeCurtain} title="Curtain Light Settings" radius="md">
        <Stack gap="md">
          <Select 
            label="Theme" 
            data={[
              { label: 'None', value: 'off' },
              { label: 'Coolest', value: '153' },
              { label: 'Cool', value: '250' },
              { label: 'Neutral', value: '370' },
              { label: 'Warm', value: '454' },
              { label: 'Warmest', value: '500' },
              { label: 'Color', value: 'Color' },
              { label: 'Mix', value: 'mix' }
            ]} 
            value={state.selectedCurtainEffect} 
            onChange={(v) => { stateHandler('selectedCurtainEffect', v); fetch(`${gateway}/curtaineffect/${v}`).then(r => r.json()); }}
          />
          <Box>
            <Text size="sm" mb={4}>Brightness</Text>
            <Slider 
              min={1} max={5} step={1} 
              value={state.curtainbrightness} 
              onChange={(v) => stateHandler('curtainbrightness', v)} 
              onChangeEnd={(v) => fetch(`${gateway}/curtainbrightness/${v*20}`).then(r => r.json())}
            />
          </Box>
          {state.selectedCurtainEffect === 'Color' && (
            <Box align="center">
              <Text size="sm" mb={4}>Color</Text>
              <HexColorPicker color={state.curtaincolor} onChange={throttledCurtainColor} />
            </Box>
          )}
        </Stack>
      </Modal>
    </Stack>
  );
}

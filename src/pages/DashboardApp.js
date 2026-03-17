import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Container, 
  Title, 
  Card, 
  Group, 
  ActionIcon, 
  Dialog, 
  Button, 
  Stack, 
  Text,
  Modal,
  Loader,
  Paper,
  Divider,
  rem
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings, IconAirConditioning, IconChevronRight } from '@tabler/icons-react';
import Page from '../components/Page';
import Scenes from '../components/_dashboard/Scenes';
import Temperature from '../components/_dashboard/temperature';
import DoorSensor from '../components/_dashboard/doorsensors';
import sidebarConfig from './../layouts/dashboard/SidebarConfig';
import Fan from '../components/_dashboard/common/Fan';
import Switch from '../components/_dashboard/common/Switch';
import ActiveDevices from '../components/_dashboard/common/ActiveDevices';
import ColorAndBrightness from '../components/_dashboard/common/ColorAndBrightness';
import { usePortalTemplate } from '../theme';
import IconM from '@mdi/react';
import { mdiWaterBoiler, mdiAirConditioner } from '@mdi/js';
import { decodeHtml } from './../utils/commons';
import { gateway } from '../constants/deviceMap';

export default function DashboardApp() {
  const { template } = usePortalTemplate();
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState({
    mfan: 'OFF', mfanspeed: 5,
    kfan: 'OFF', kfanspeed: 5,
    lfan: 'OFF', lfanspeed: 5,
    dfan: 'OFF', dfanspeed: 5,
    ofan: 'OFF', ofanspeed: 5,
    mgyser: 'OFF', kgyser: 'OFF', ogyser: 'OFF'
  });

  const stateHandler = (obj, val) => {
    setStates(prev => ({ ...prev, [obj]: val }));
  };

  const handleAllACOff = () => fetch(`${gateway}/allacoff/`).then(res => res.json());
  const handleAllACOn = () => fetch(`${gateway}/allacon/`).then(res => res.json());

  useEffect(() => {
    const fetchData = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const endpoints = [
          { url: '/ogyserstatus', key: '2', field: 'ogyser' },
          { url: '/mgyserstatus', key: '2', field: 'mgyser' },
          { url: '/kgyserstatus', key: '8', field: 'kgyser' },
          { url: '/oboardtwostatus', key: '1', field: 'ofan', speedField: 'ofanspeed' },
          { url: '/lacboardstatus', key: '1', field: 'lfan', speedField: 'lfanspeed' },
          { url: '/dboardstatus', key: '1', field: 'dfan', speedField: 'dfanspeed' },
          { url: '/kboardtwostatus', key: '1', field: 'kfan', speedField: 'kfanspeed' },
          { url: '/mboardtwostatus', key: '1', field: 'mfan', speedField: 'mfanspeed' }
        ];

        const results = await Promise.all(
          endpoints.map(e => 
            fetch(`${gateway}${e.url}`, { signal: controller.signal })
              .then(r => r.text())
              .catch(() => '{}')
          )
        );

        clearTimeout(timeoutId);

        const newStates = { ...states };
        results.forEach((rawData, i) => {
          try {
            const config = endpoints[i];
            const data = JSON.parse(decodeHtml(rawData));
            const deviceData = data[config.key];
            
            if (deviceData) {
              newStates[config.field] = deviceData.power;
              if (config.speedField) {
                newStates[config.speedField] = Math.round(deviceData.speed / 20);
              }
            }
          } catch(e) {}
        });

        setStates(newStates);
      } catch (err) {
        console.error('Dashboard state fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const refreshId = setInterval(() => window.location.reload(), 300000);
    return () => clearInterval(refreshId);
  }, []);

  return (
    <Page title="Myhome E302">
      <Container size="xl" py="xl">
        <Grid gutter="xl">
          {/* Welcome Section - Wide Span */}
          <Grid.Col span={12}>
            <Box mb="md">
              <Title order={1} fw={900} style={{ fontSize: rem(42), letterSpacing: '-1px' }}>
                Welcome, <Text component="span" variant="gradient" gradient={template === 'control' ? { from: 'orange', to: 'red' } : { from: 'teal', to: 'cyan' }} inherit>E302</Text>
              </Title>
              <Text c="dimmed" fw={500}>System status is normal. Dashboard in {template.charAt(0).toUpperCase() + template.slice(1)} mode.</Text>
            </Box>
          </Grid.Col>

          {/* Active Appliances - Bento Span */}
          <Grid.Col span={{ base: 12, md: template === 'classic' ? 12 : 8 }}>
            <Paper className={template !== 'classic' ? "glass-container bento-card" : ""} shadow={template === 'classic' ? 'sm' : 'none'} p="xl" withBorder={template === 'classic'}>
              <ActiveDevices />
            </Paper>
          </Grid.Col>

          {/* Sensors - Bento Span */}
          <Grid.Col span={{ base: 12, md: template === 'classic' ? 12 : 4 }}>
            <Paper className={template !== 'classic' ? "glass-container bento-card" : ""} shadow={template === 'classic' ? 'sm' : 'none'} p="xl" h="100%" withBorder={template === 'classic'}>
              <Stack gap="xl">
                <Text size="xs" fw={700} c="dimmed" tt="uppercase" ls="1px">Environment</Text>
                <Group justify="space-between">
                   <Temperature room="living" />
                </Group>
                <Divider opacity={0.1} />
                <Stack gap="sm">
                  <DoorSensor room="Main balcony" />
                  <DoorSensor room="Service balcony" />
                </Stack>
              </Stack>
            </Paper>
          </Grid.Col>

          {loading ? (
            <Grid.Col span={12}>
              <Paper className={template !== 'classic' ? "glass-container bento-card" : ""} shadow={template === 'classic' ? 'sm' : 'none'} p="50px" withBorder={template === 'classic'}>
                <Group justify="center">
                  <Loader color={template === 'control' ? 'orange' : 'teal'} size="xl" type="bars" />
                  <Text fw={600} size="lg">Initializing Home Control...</Text>
                </Group>
              </Paper>
            </Grid.Col>
          ) : (
            <>
              {/* Fans Section */}
              <Grid.Col span={12}>
                <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="md" ls="1px">Fans & Circulation</Text>
                <Grid gutter="lg">
                  {[
                    { id: 'dfan', name: 'Drawing' },
                    { id: 'mfan', name: 'Bedroom' },
                    { id: 'lfan', name: 'Living' },
                    { id: 'kfan', name: 'Kids' },
                    { id: 'ofan', name: 'Office' }
                  ].map(fan => (
                    <Grid.Col key={fan.id} span={{ base: 12, sm: 6, lg: template === 'classic' ? 4 : 4 }}>
                      <Paper className={template !== 'classic' ? "glass-container bento-card" : ""} shadow={template === 'classic' ? 'xs' : 'none'} p="md" withBorder={template === 'classic'}>
                        <Fan 
                          sVal={states[fan.id]} 
                          sFval={states[`${fan.id}speed`]} 
                          sID={fan.id} 
                          sIDFS={`${fan.id}speed`} 
                          sName={fan.name} 
                          stateHandler={stateHandler} 
                        />
                      </Paper>
                    </Grid.Col>
                  ))}
                </Grid>
              </Grid.Col>

              {/* Geysers Section */}
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="md" ls="1px">Geysers</Text>
                <Grid gutter="lg">
                  {[
                    { id: 'mgyser', name: 'Bedroom' },
                    { id: 'ogyser', name: 'Office' },
                    { id: 'kgyser', name: 'Kids' }
                  ].map(gyser => (
                    <Grid.Col key={gyser.id} span={{ base: 12, sm: 4 }}>
                      <Paper className={template !== 'classic' ? "glass-container bento-card" : ""} shadow={template === 'classic' ? 'xs' : 'none'} p="md" withBorder={template === 'classic'}>
                        <Switch 
                          sVal={states[gyser.id]} 
                          sID={gyser.id} 
                          sIcon={mdiWaterBoiler} 
                          sName={gyser.name} 
                          stateHandler={stateHandler} 
                        />
                      </Paper>
                    </Grid.Col>
                  ))}
                </Grid>
              </Grid.Col>

              {/* Scenes Section */}
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="md" ls="1px">Quick Scenes</Text>
                <Paper className={template !== 'classic' ? "glass-container bento-card" : ""} shadow={template === 'classic' ? 'sm' : 'none'} p="xl" h="calc(100% - 32px)" withBorder={template === 'classic'}>
                   <Scenes />
                </Paper>
              </Grid.Col>
            </>
          )}
        </Grid>
      </Container>
    </Page>
  );
}

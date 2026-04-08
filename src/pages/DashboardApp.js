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
import { decodeHtml } from './../utils/commons';
import { gateway, deviceMap } from '../constants/deviceMap';
import { getRecents } from '../utils/recents';
import { mdiWaterBoiler, mdiAirConditioner, mdiLightbulbVariant, mdiPowerSocketEu } from '@mdi/js';

export default function DashboardApp() {
  const { template } = usePortalTemplate();
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState({});
  const [recentEndpoints, setRecentEndpoints] = useState([]);

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
        const savedRecents = getRecents();
        const defaultPins = ['mfan', 'mgyser', 'lfan', 'dfan', 'kfan', 'ofan', 'oac', 'lines', 'serotv', 'maczone'];
        
        let combinedIds = [...savedRecents];
        if (combinedIds.length < 10) {
          const needed = 10 - combinedIds.length;
          const availableDefaults = defaultPins.filter(id => !combinedIds.includes(id));
          combinedIds = [...combinedIds, ...availableDefaults.slice(0, needed)];
        }
        
        let endpointsConfig = combinedIds
          .map(id => deviceMap.find(d => d.id === id))
          .filter(Boolean)
          .map(d => ({ url: d.url, key: d.key, field: d.id, speedField: d.type === 'fan' ? `${d.id}speed` : undefined, type: d.type, name: d.name }));

        const results = await Promise.all(
          endpointsConfig.map(e => 
            fetch(`${gateway}${e.url}`, { signal: controller.signal })
              .then(r => r.text())
              .catch(() => '{}')
          )
        );

        clearTimeout(timeoutId);

        const newStates = { ...states };
        results.forEach((rawData, i) => {
          try {
            const config = endpointsConfig[i];
            const data = JSON.parse(decodeHtml(rawData));
            const deviceData = config.type === 'switch' && typeof data.state !== 'undefined' ? data : data[config.key];
            
            if (deviceData) {
              const powerVal = typeof deviceData === 'string' 
                ? deviceData 
                : (deviceData.power || deviceData.state || 'OFF');
              newStates[config.field] = powerVal;
              if (config.speedField && deviceData.speed !== undefined) {
                newStates[config.speedField] = Math.round(deviceData.speed / 20);
              }
            }
          } catch(e) {}
        });

        setRecentEndpoints(endpointsConfig);
        setStates(prev => ({ ...prev, ...newStates }));
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
      <Container size="xl" py="md">
        <Grid gutter="md">
          {/* Welcome Section - Wide Span */}
          <Grid.Col span={12}>
            <Box mb="md">
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Title order={1} fw={900} style={{ fontSize: rem(42), letterSpacing: '-1px' }}>
                    Welcome, <Text component="span" variant="gradient" gradient={template === 'control' ? { from: 'orange', to: 'red' } : { from: 'teal', to: 'cyan' }} inherit>E302</Text>
                  </Title>
                  <Text c="dimmed" fw={500}>System status is normal. Dashboard in {template.charAt(0).toUpperCase() + template.slice(1)} mode.</Text>
                </Box>
                <Group gap="md">
                  <Paper p="sm" radius="md" withBorder className={template !== 'classic' ? "glass-container" : ""}>
                    <Temperature room="living" />
                  </Paper>
                  <Paper p="sm" radius="md" withBorder className={template !== 'classic' ? "glass-container" : ""}>
                    <Group gap="md" align="center">
                      <DoorSensor room="Main balcony" />
                      <DoorSensor room="Service balcony" />
                    </Group>
                  </Paper>
                </Group>
              </Group>
            </Box>
          </Grid.Col>

          {/* Active Appliances - Bento Span */}
          <Grid.Col span={12}>
            <Paper className={template !== 'classic' ? "glass-container bento-card" : ""} shadow={template === 'classic' ? 'sm' : 'none'} p="md" withBorder={template === 'classic'}>
              <ActiveDevices />
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
              {/* Recents Section */}
              {recentEndpoints.length > 0 && (
                <Grid.Col span={12}>
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Recently Used</Text>
                  <Paper className={template !== 'classic' ? "glass-container bento-card" : ""} shadow={template === 'classic' ? 'sm' : 'none'} p="md" withBorder={template === 'classic'}>
                    <Grid gutter="md">
                      {recentEndpoints.map(device => {
                        let renderItem = null;
                        if (device.type === 'fan') {
                          renderItem = (
                            <Fan 
                              sVal={states[device.field]} 
                              sFval={states[`${device.field}speed`]} 
                              sID={device.field} 
                              sIDFS={`${device.field}speed`} 
                              sName={device.name} 
                              stateHandler={stateHandler} 
                            />
                          );
                        } else {
                          let iconPath = mdiLightbulbVariant;
                          if (device.type === 'geyser') iconPath = mdiWaterBoiler;
                          if (device.type === 'socket') iconPath = mdiPowerSocketEu;
                          if (device.type === 'ac') iconPath = mdiAirConditioner;
                          
                          renderItem = (
                            <Switch 
                              sVal={states[device.field]} 
                              sID={device.field} 
                              sIcon={iconPath} 
                              sName={device.name} 
                              stateHandler={stateHandler} 
                            />
                          );
                        }

                        return (
                          <Grid.Col key={device.field} span={{ base: 12, sm: 6, lg: 4 }}>
                            {renderItem}
                          </Grid.Col>
                        );
                      })}
                    </Grid>
                  </Paper>
                </Grid.Col>
              )}

              {/* Scenes Section */}
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Quick Scenes</Text>
                <Paper className={template !== 'classic' ? "glass-container bento-card" : ""} shadow={template === 'classic' ? 'sm' : 'none'} p="md" h="calc(100% - 28px)" withBorder={template === 'classic'}>
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

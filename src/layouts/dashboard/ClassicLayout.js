import { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  AppShell, Burger, Group, Text, NavLink, Stack, ScrollArea, rem,
  Avatar, Box, ActionIcon, Tooltip, useMantineColorScheme, SegmentedControl, Modal, Button, Grid 
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSun, IconMoon, IconAdjustments, IconSettings, IconAirConditioning } from '@tabler/icons-react';
import ColorAndBrightness from '../../components/_dashboard/common/ColorAndBrightness';
import { gateway } from '../../constants/deviceMap';
import sidebarConfig from './SidebarConfig';
import account from '../../_mocks_/account';
import { useThemeMode, usePortalTemplate } from '../../theme';
import Logo from '../../components/Logo';
import Searchbar from './MantineSearchbar';
import './app.css';

export default function ClassicLayout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const [openedSettings, { open: openSettings, close: closeSettings }] = useDisclosure(false);
  const { mode, toggleThemeMode } = useThemeMode();
  const { template, setTemplate } = usePortalTemplate();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const handleAllACOff = () => fetch(`${gateway}/allacoff/`).then(res => res.json());
  const handleAllACOn = () => fetch(`${gateway}/allacon/`).then(res => res.json());

  const handleThemeToggle = () => {
    const AVAILABLE_MODES = ['dark', 'light', 'ocean', 'forest'];
    const currentIndex = AVAILABLE_MODES.indexOf(mode);
    const nextMode = AVAILABLE_MODES[(currentIndex + 1) % AVAILABLE_MODES.length];
    
    toggleThemeMode();
    setColorScheme(nextMode === 'dark' ? 'dark' : 'light');
  };

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
      styles={(theme) => ({
        main: { backgroundColor: mode === 'dark' ? '#1a1b1e' : '#f8f9fa' }
      })}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="lg">
            <Group>
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Box component={RouterLink} to="/" style={{ display: 'flex', alignItems: 'center' }}>
                <Logo />
              </Box>
            </Group>
            
            <Group gap="xs" style={{ 
              backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
              padding: '6px 14px 6px 6px', borderRadius: rem(30)
            }}>
              <Avatar src={account.photoURL} radius="xl" size={rem(28)} />
              <Text size="sm" fw={600}>{account.displayName}</Text>
            </Group>
          </Group>
          
          <Group gap="xl" visibleFrom="md">
            <SegmentedControl 
              value={template}
              onChange={setTemplate}
              radius="md" size="sm"
              data={[
                { label: 'Classic', value: 'classic' },
                { label: 'Bento', value: 'bento' },
                { label: 'Control', value: 'control' },
              ]}
              styles={{
                root: { backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' },
                indicator: { boxShadow: 'var(--mantine-shadow-xs)' }
              }}
            />
          </Group>

          <Group>
            <Searchbar />
            <Tooltip label="Home Settings">
              <ActionIcon variant="default" onClick={openSettings} size="lg">
                <IconSettings size="1.2rem" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={colorScheme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
              <ActionIcon variant="default" onClick={handleThemeToggle} size="lg">
                {colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoon size="1.2rem" />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          <Stack gap="xs">
            {sidebarConfig.map((item) => (
              <NavLink
                key={item.title}
                component={RouterLink}
                to={item.path}
                label={item.title}
                leftSection={item.icon}
                active={location.pathname === item.path}
                variant="filled"
                styles={{
                  root: { borderRadius: 'var(--mantine-radius-md)', padding: rem(12) },
                  leftSection: { margin: 0 },
                  label: { textTransform: 'capitalize', fontWeight: 600, fontSize: rem(13) }
                }}
              />
            ))}
          </Stack>
        </AppShell.Section>

        <AppShell.Section mt="md">
           <NavLink 
             label={`Theme: ${mode}`} 
             leftSection={<IconAdjustments size="1.2rem" />}
             onClick={handleThemeToggle}
             styles={{
               root: { borderRadius: 'var(--mantine-radius-md)', padding: rem(12) },
               leftSection: { margin: 0 }
             }}
           />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <Modal opened={openedSettings} onClose={closeSettings} title="Home Settings" radius="md">
        <Stack gap="md">
          <Box hiddenFrom="md">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs">Portal Template</Text>
            <SegmentedControl 
              fullWidth value={template} onChange={setTemplate}
              data={[
                { label: 'Classic', value: 'classic' },
                { label: 'Bento', value: 'bento' },
                { label: 'Control', value: 'control' },
              ]}
            />
          </Box>
          <ColorAndBrightness sColor="commoncolor" sBrightness="commonbright" />
          <Grid>
            <Grid.Col span={6}>
              <Button fullWidth variant="light" color="teal" leftSection={<IconAirConditioning size="1rem" />} onClick={handleAllACOn}>
                All AC On
              </Button>
            </Grid.Col>
            <Grid.Col span={6}>
              <Button fullWidth variant="light" color="red" leftSection={<IconAirConditioning size="1rem" />} onClick={handleAllACOff}>
                All AC Off
              </Button>
            </Grid.Col>
          </Grid>
        </Stack>
      </Modal>
    </AppShell>
  );
}

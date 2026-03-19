import { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  AppShell, Group, Text, Stack, ScrollArea, rem, Avatar, Box, ActionIcon, 
  Tooltip, useMantineColorScheme, SegmentedControl, Modal, Button, Grid 
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSun, IconMoon, IconSettings, IconAirConditioning, IconPalette } from '@tabler/icons-react';
import ColorAndBrightness from '../../components/_dashboard/common/ColorAndBrightness';
import { gateway } from '../../constants/deviceMap';
import sidebarConfig from './SidebarConfig';
import account from '../../_mocks_/account';
import { useThemeMode, usePortalTemplate } from '../../theme';
import Logo from '../../components/Logo';
import Searchbar from './MantineSearchbar';
import './app.css';

export default function ControlLayout() {
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
      navbar={{ width: 80, breakpoint: 'sm', collapsed: { mobile: true } }}
      padding="xs"
      styles={(theme) => ({
        main: { backgroundColor: mode === 'dark' ? '#121212' : '#f0f2f5' }
      })}
    >
      <AppShell.Header className="glass-container" style={{ borderBottom: '1px solid rgba(128,128,128,0.1)' }}>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="lg">
            <Box component={RouterLink} to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <Logo />
            </Box>
          </Group>
          
          <Group gap="xl" visibleFrom="md">
            <SegmentedControl 
              value={template} onChange={setTemplate} radius="lg" size="sm"
              data={[
                { label: 'Classic', value: 'classic' },
                { label: 'Bento', value: 'bento' },
                { label: 'Control', value: 'control' },
              ]}
              styles={{
                indicator: { boxShadow: 'var(--mantine-shadow-xs)' }
              }}
            />
          </Group>

          <Group>
            <Group gap="xs" style={{ 
              backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
              padding: '4px', borderRadius: rem(30)
            }}>
              <Avatar src={account.photoURL} radius="xl" size={rem(32)} />
            </Group>
            <ActionIcon variant="transparent" onClick={openSettings} size="lg" radius="xl">
              <IconSettings size="1.4rem" color={mode === 'dark' ? '#eee' : '#555'} />
            </ActionIcon>
            <ActionIcon variant="transparent" onClick={handleThemeToggle} size="lg" radius="xl" visibleFrom="sm">
              {colorScheme === 'dark' ? <IconSun size="1.4rem" color="#eee" /> : <IconMoon size="1.4rem" color="#555" />}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Desktop Side Rail */}
      <AppShell.Navbar p="sm" className="glass-container" style={{ borderRight: '1px solid rgba(128,128,128,0.1)' }}>
        <Stack align="center" gap="lg" mt="md">
          {sidebarConfig.map((item) => (
             <Tooltip label={item.title} key={item.title} position="right" withArrow>
               <ActionIcon 
                 component={RouterLink} 
                 to={item.path}
                 variant={location.pathname === item.path ? 'light' : 'subtle'}
                 color={location.pathname === item.path ? 'teal' : undefined}
                 c={location.pathname === item.path ? undefined : (mode === 'dark' ? '#e0e0e0' : '#555')}
                 size="xl" 
                 radius="xl"
               >
                 {item.icon}
               </ActionIcon>
             </Tooltip>
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box maw={1400} mx="auto">
          <Outlet />
        </Box>
      </AppShell.Main>

      {/* Mobile Floating Menu */}
      <Box
        hiddenFrom="sm"
        className="glass-container"
        style={{
          position: 'fixed',
          bottom: rem(20),
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          borderRadius: rem(30),
          boxShadow: 'var(--mantine-shadow-xl)',
          border: '1px solid rgba(128,128,128,0.2)',
          padding: rem(6)
        }}
      >
        <Group justify="center" align="center" gap="xs" wrap="nowrap">
          {sidebarConfig.slice(0, 5).map(item => (
            <ActionIcon 
              key={item.title}
              component={RouterLink} 
              to={item.path}
              variant={location.pathname === item.path ? 'light' : 'subtle'}
              color={location.pathname === item.path ? 'teal' : undefined}
              c={location.pathname === item.path ? undefined : (mode === 'dark' ? '#e0e0e0' : '#555')}
              size={rem(48)}
              radius="xl"
            >
              {item.icon}
            </ActionIcon>
          ))}
        </Group>
      </Box>

      <Modal opened={openedSettings} onClose={closeSettings} title="Control Settings" radius="xl">
        <Stack gap="md">
          <Box hiddenFrom="md">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs">Portal Template</Text>
            <SegmentedControl 
              fullWidth value={template} onChange={setTemplate} color="orange"
              data={[
                { label: 'Classic', value: 'classic' },
                { label: 'Bento', value: 'bento' },
                { label: 'Control', value: 'control' },
              ]}
            />
          </Box>
          <Box hiddenFrom="sm">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs">Theme Mode</Text>
            <Button fullWidth variant="light" color="orange" rightSection={<IconPalette size="1rem" />} onClick={handleThemeToggle}>
              Cycle Theme (Current: {mode})
            </Button>
          </Box>
          <ColorAndBrightness sColor="commoncolor" sBrightness="commonbright" />
          <Grid>
            <Grid.Col span={6}>
              <Button fullWidth variant="light" color="teal" onClick={handleAllACOn}>All AC On</Button>
            </Grid.Col>
            <Grid.Col span={6}>
              <Button fullWidth variant="light" color="red" onClick={handleAllACOff}>All AC Off</Button>
            </Grid.Col>
          </Grid>
        </Stack>
      </Modal>
    </AppShell>
  );
}

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

export default function BentoLayout() {
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
      header={{ height: 130 }}
      padding="xl"
      styles={(theme) => ({
        main: {
          backgroundImage: mode === 'dark' 
            ? 'radial-gradient(circle at top right, rgba(20, 150, 150, 0.05), transparent), radial-gradient(circle at bottom left, rgba(150, 20, 150, 0.05), transparent)'
            : 'radial-gradient(circle at top right, rgba(0, 150, 255, 0.03), transparent), radial-gradient(circle at bottom left, rgba(255, 150, 0, 0.03), transparent)',
        }
      })}
    >
      <AppShell.Header className="glass-container" style={{ border: 'none' }}>
        <Stack h="100%" px={{ base: 'md', md: 'xl' }} py="sm" gap="xs">
          <Group justify="space-between">
            <Group gap="lg">
              <Box component={RouterLink} to="/" style={{ display: 'flex', alignItems: 'center' }}>
                <Logo />
              </Box>
              <Group gap="xs" style={{ 
                backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', 
                padding: '6px 14px 6px 6px', borderRadius: rem(30)
              }}>
                <Avatar src={account.photoURL} radius="xl" size={rem(28)} />
                <Text size="sm" fw={600} visibleFrom="sm">{account.displayName}</Text>
              </Group>
            </Group>
            
            <Group gap="xl" visibleFrom="md">
              <SegmentedControl 
                value={template} onChange={setTemplate} radius="xl" size="sm"
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
                <ActionIcon variant="light" color="teal" onClick={openSettings} size="lg" radius="xl">
                  <IconSettings size="1.2rem" />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={colorScheme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
                <ActionIcon variant="light" color="teal" onClick={handleThemeToggle} size="lg" radius="xl">
                  {colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoon size="1.2rem" />}
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          {/* Horizontal Navigation for Bento */}
          <ScrollArea type="never" w="100%">
            <Group gap="sm" wrap="nowrap" mt="xs">
              {sidebarConfig.map(item => (
                <Button 
                   key={item.title}
                   component={RouterLink} 
                   to={item.path} 
                   variant={location.pathname === item.path ? 'filled' : 'light'}
                   color={location.pathname === item.path ? "teal" : "gray"}
                   leftSection={item.icon}
                   radius="xl"
                   tt="capitalize"
                   styles={{
                     root: { 
                       transition: 'all 0.2s ease', 
                       flexShrink: 0,
                       backgroundColor: location.pathname === item.path ? undefined : (mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') 
                     }
                   }}
                >
                  {item.title}
                </Button>
              ))}
            </Group>
          </ScrollArea>
        </Stack>
      </AppShell.Header>

      <AppShell.Main>
        <Box maw={1600} mx="auto">
          <Outlet />
        </Box>
      </AppShell.Main>

      <Modal opened={openedSettings} onClose={closeSettings} title="Home Settings" radius="xl">
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
          <Box hiddenFrom="md">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs">Theme Mode</Text>
            <Button fullWidth variant="light" rightSection={<IconPalette size="1rem" />} onClick={handleThemeToggle}>
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

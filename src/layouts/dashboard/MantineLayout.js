import { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  AppShell, 
  Burger, 
  Group, 
  Text, 
  NavLink, 
  Stack, 
  ScrollArea, 
  rem,
  Avatar,
  Box,
  ActionIcon,
  Tooltip,
  useMantineColorScheme,
  SegmentedControl
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSun, IconMoon, IconSearch, IconAdjustments, IconUser, IconSettings, IconAirConditioning } from '@tabler/icons-react';
import { Modal, Button, Grid } from '@mantine/core';
import ColorAndBrightness from '../../components/_dashboard/common/ColorAndBrightness';
import { gateway } from '../../constants/deviceMap';
import sidebarConfig from './SidebarConfig';
import account from '../../_mocks_/account';
import { useThemeMode, usePortalTemplate } from '../../theme';
import Logo from '../../components/Logo';
import Searchbar from './MantineSearchbar';
import './app.css';

export default function MantineLayout() {
  const [opened, { toggle }] = useDisclosure();
  const [hovered, setHovered] = useState(false);
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
      navbar={{
        width: template === 'classic' ? 250 : (hovered ? 250 : 80),
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={(theme) => ({
        main: {
          backgroundColor: mode === 'dark' ? '#1a1b1e' : '#f8f9fa',
          backgroundImage: template === 'classic' ? 'none' : (mode === 'dark' 
            ? 'radial-gradient(circle at top right, rgba(20, 150, 150, 0.05), transparent), radial-gradient(circle at bottom left, rgba(150, 20, 150, 0.05), transparent)'
            : 'radial-gradient(circle at top right, rgba(0, 150, 255, 0.03), transparent), radial-gradient(circle at bottom left, rgba(255, 150, 0, 0.03), transparent)'),
        }
      })}
    >
      <AppShell.Header className={template !== 'classic' ? "glass-container" : ""} style={{ border: template === 'classic' ? undefined : 'none' }}>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Box component={RouterLink} to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <Logo />
            </Box>
          </Group>
          
          <Group gap="xl" visibleFrom="md">
            <SegmentedControl 
              value={template}
              onChange={setTemplate}
              radius="md"
              size="sm"
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
              <ActionIcon 
                variant="default" 
                onClick={openSettings} 
                size="lg" 
              >
                <IconSettings size="1.2rem" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={colorScheme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
              <ActionIcon 
                variant="default" 
                onClick={handleThemeToggle} 
                size="lg" 
                aria-label="Toggle color scheme"
              >
                {colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoon size="1.2rem" />}
              </ActionIcon>
            </Tooltip>
            <Avatar src={account.photoURL} radius="xl" />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar 
        className={template !== 'classic' ? `glass-container mini-sidebar ${hovered ? 'expanded' : ''}` : ''}
        p="md"
        onMouseEnter={() => template !== 'classic' && setHovered(true)}
        onMouseLeave={() => template !== 'classic' && setHovered(false)}
        style={{ border: template === 'classic' ? undefined : 'none' }}
      >
        <AppShell.Section mb="md">
           <Group p="xs" wrap="nowrap" style={{ 
             backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
             borderRadius: 'var(--mantine-radius-md)',
             overflow: 'hidden'
           }}>
             <Avatar src={account.photoURL} radius="xl" size={rem(40)} style={{ flexShrink: 0 }} />
             <div style={{ flex: 1, opacity: (template === 'classic' || hovered) ? 1 : 0, transition: 'opacity 200ms ease', whiteSpace: 'nowrap' }}>
               <Text size="sm" fw={600}>{account.displayName}</Text>
               <Text size="xs" c="dimmed">{account.role}</Text>
             </div>
           </Group>
        </AppShell.Section>

        <AppShell.Section grow component={ScrollArea}>
          <Stack gap="xs">
            {sidebarConfig.map((item) => (
              <NavLink
                key={item.title}
                component={RouterLink}
                to={item.path}
                label={(template === 'classic' || hovered) ? item.title : null}
                leftSection={item.icon}
                active={location.pathname === item.path}
                variant="filled"
                styles={{
                  root: { 
                    borderRadius: 'var(--mantine-radius-md)',
                    padding: rem(12),
                    justifyContent: (template === 'classic' || hovered) ? 'flex-start' : 'center'
                  },
                  leftSection: { margin: 0, transition: 'transform 0.2s ease' },
                  label: { 
                    textTransform: 'capitalize', 
                    fontWeight: 600,
                    fontSize: rem(13)
                  }
                }}
              />
            ))}
          </Stack>
        </AppShell.Section>

        <AppShell.Section mt="md">
           <NavLink 
             label={(template === 'classic' || hovered) ? `Theme: ${mode}` : null} 
             leftSection={<IconAdjustments size="1.2rem" />}
             onClick={handleThemeToggle}
             styles={{
               root: { 
                 borderRadius: 'var(--mantine-radius-md)',
                 padding: rem(12),
                 justifyContent: (template === 'classic' || hovered) ? 'flex-start' : 'center'
               },
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
              fullWidth
              value={template}
              onChange={setTemplate}
              data={[
                { label: 'Classic', value: 'classic' },
                { label: 'Bento', value: 'bento' },
                { label: 'Control', value: 'control' },
              ]}
            />
          </Box>
          <ColorAndBrightness 
            sColor="commoncolor" 
            sBrightness="commonbright" 
          />
          <Grid>
            <Grid.Col span={6}>
              <Button 
                fullWidth 
                variant="light" 
                color="teal" 
                leftSection={<IconAirConditioning size="1rem" />}
                onClick={handleAllACOn}
              >
                All AC On
              </Button>
            </Grid.Col>
            <Grid.Col span={6}>
              <Button 
                fullWidth 
                variant="light" 
                color="red" 
                leftSection={<IconAirConditioning size="1rem" />}
                onClick={handleAllACOff}
              >
                All AC Off
              </Button>
            </Grid.Col>
          </Grid>
        </Stack>
      </Modal>
    </AppShell>
  );
}

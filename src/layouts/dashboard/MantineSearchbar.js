import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  ActionIcon,
  Modal,
  Group,
  Text,
  UnstyledButton,
  ScrollArea,
  Stack,
  Paper,
  Divider,
  Box,
  rem,
  rgba,
  useMantineTheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconArrowRight, IconPower, IconExternalLink } from '@tabler/icons-react';
import { deviceMap, gateway } from '../../constants/deviceMap';
import sidebarConfig from './SidebarConfig';

export default function MantineSearchbar() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ rooms: [], devices: [] });

  useEffect(() => {
    if (!query.trim()) {
      setResults({ rooms: [], devices: [] });
      return;
    }

    const q = query.toLowerCase();
    const filteredRooms = sidebarConfig.filter((item) => 
      item.title.toLowerCase().includes(q)
    );
    const filteredDevices = deviceMap.filter((device) => 
      device.name.toLowerCase().includes(q) || 
      device.type.toLowerCase().includes(q)
    );

    setResults({ rooms: filteredRooms, devices: filteredDevices });
  }, [query]);

  const handleDeviceAction = (device) => {
    fetch(`${gateway}/${device.id}/off`)
      .then(() => close())
      .catch((err) => console.error('Search action failed:', err));
  };

  const handleRoomClick = (path) => {
    navigate(path);
    close();
  };

  return (
    <>
      <ActionIcon variant="default" onClick={open} size="lg" radius="md">
        <IconSearch size="1.2rem" />
      </ActionIcon>

      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        padding={0}
        radius="lg"
        size="lg"
        overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
      >
        <Paper p="md" shadow="xl">
          <TextInput
            placeholder="Search rooms or devices..."
            size="md"
            leftSection={<IconSearch size="1.2rem" />}
            rightSection={<Text size="xs" c="dimmed">ESC</Text>}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            data-autofocus
            styles={{
              input: { border: 'none', fontSize: rem(18) }
            }}
          />
          
          <Divider my="sm" />

          <ScrollArea.Autosize mah={400} type="scroll">
            {(results.rooms.length > 0 || results.devices.length > 0) ? (
              <Stack gap="xs" p="xs">
                {results.rooms.length > 0 && (
                  <>
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase" px="xs">Rooms</Text>
                    {results.rooms.map((room) => (
                      <UnstyledButton
                        key={room.title}
                        onClick={() => handleRoomClick(room.path)}
                        p="xs"
                        styles={{
                          root: {
                            borderRadius: theme.radius.md,
                            '&:hover': { backgroundColor: 'var(--mantine-color-gray-1)' }
                          }
                        }}
                      >
                        <Group justify="space-between">
                          <Group>
                            <IconExternalLink size="1rem" opacity={0.5} />
                            <Text size="sm" fw={500} style={{ textTransform: 'capitalize' }}>{room.title}</Text>
                          </Group>
                          <IconArrowRight size="0.8rem" opacity={0.3} />
                        </Group>
                      </UnstyledButton>
                    ))}
                  </>
                )}

                {results.devices.length > 0 && (
                  <>
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase" px="xs" mt="sm">Devices (Quick Off)</Text>
                    {results.devices.map((device) => (
                      <UnstyledButton
                        key={device.id}
                        onClick={() => handleDeviceAction(device)}
                        p="xs"
                        styles={{
                          root: {
                            borderRadius: theme.radius.md,
                            '&:hover': { 
                              backgroundColor: rgba(theme.colors.red[0], 0.1),
                              color: theme.colors.red[6]
                            }
                          }
                        }}
                      >
                        <Group justify="space-between">
                          <Stack gap={0}>
                            <Text size="sm" fw={500}>{device.name}</Text>
                            <Text size="xs" c="dimmed">{device.type}</Text>
                          </Stack>
                          <IconPower size="1.1rem" />
                        </Group>
                      </UnstyledButton>
                    ))}
                  </>
                )}
              </Stack>
            ) : query.trim() ? (
              <Box p="xl" style={{ textAlign: 'center' }}>
                <Text c="dimmed">No results found for "{query}"</Text>
              </Box>
            ) : null}
          </ScrollArea.Autosize>
        </Paper>
      </Modal>
    </>
  );
}

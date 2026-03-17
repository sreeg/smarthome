import React from 'react';
import { 
  Grid, 
  UnstyledButton, 
  Paper, 
  Text, 
  Stack, 
  rem,
  useMantineTheme
} from '@mantine/core';
import { mdiMovieOpen } from '@mdi/js';
import { GiExitDoor, GiEntryDoor, GiCandleFlame } from 'react-icons/gi';
import { MdBedtime } from 'react-icons/md';
import Icon from '@mdi/react';
import { gateway } from '../../../constants/deviceMap';

const ICON_SIZE = rem(32);

export default function Scenes() {
  const theme = useMantineTheme();

  const handleAction = (endpoint) => {
    fetch(`${gateway}${endpoint}`).then((response) => response.json());
  };

  const sceneButtons = [
    { title: 'Movie mode', icon: <Icon path={mdiMovieOpen} size={1.2} />, endpoint: '/movietime/' },
    { title: 'Cozy mode', icon: <GiCandleFlame size={ICON_SIZE} />, endpoint: '/dinningcozy/' },
    { title: 'Bedtime', icon: <MdBedtime size={ICON_SIZE} />, endpoint: '/bedtime/' },
    { title: 'Home entry', icon: <GiEntryDoor size={ICON_SIZE} />, endpoint: '/dinningcozy/' }, // assuming same for now as original
    { title: 'Home exit', icon: <GiExitDoor size={ICON_SIZE} />, endpoint: '/dinningcozy/' }  // assuming same for now as original
  ];

  return (
    <Box>
      <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" ls="1px">Scenes</Text>
      <Grid gutter="md">
        {sceneButtons.map((scene, index) => (
          <Grid.Col key={index} span={{ base: 6, sm: 4, lg: 2.4 }}>
            <Paper shadow="sm" radius="md" withBorder style={{ overflow: 'hidden' }}>
              <UnstyledButton
                onClick={() => handleAction(scene.endpoint)}
                p="md"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: rem(8),
                  transition: 'all 0.2s ease',
                  backgroundColor: 'var(--mantine-color-gray-0)',
                  '&:hover': {
                    backgroundColor: 'var(--mantine-color-gray-1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <div style={{ color: 'var(--mantine-color-orange-6)' }}>
                  {scene.icon}
                </div>
                <Text size="xs" fw={600} style={{ textAlign: 'center' }}>
                  {scene.title}
                </Text>
              </UnstyledButton>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}

// Helper to make it work since I used Box in return but didn't import it in this specific block
import { Box } from '@mantine/core';

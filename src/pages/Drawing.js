import { Box, Container, Title, Group } from '@mantine/core';
import Page from '../components/Page';
import DrawingRoom from '../components/_dashboard/drawing';
import { Icon } from '@iconify/react';
import tvFill from '@iconify/icons-eva/tv-fill';
import sidebarConfig from './../layouts/dashboard/SidebarConfig';

export default function Drawing() {
  return (
    <Page title="Drawing">
      <Container size="xl">
        <Group mb="sm">
          <Icon icon={tvFill} width={24} height={24} />
          <Title order={2}>Drawing Room</Title>
        </Group>

        <DrawingRoom />
      </Container>
    </Page>
  );
}

import { Box, Container, Title, Group } from '@mantine/core';
import Page from '../components/Page';
import BedRoom from '../components/_dashboard/bedroom';
import { Icon } from '@iconify/react';
import bed from '@iconify/icons-mdi/bed';
import sidebarConfig from './../layouts/dashboard/SidebarConfig';

export default function Bedroom() {
  return (
    <Page title="Bedroom">
      <Container size="xl">
        <Group mb="sm">
          <Icon icon={bed} width={24} height={24} />
          <Title order={2}>Bedroom</Title>
        </Group>

        <BedRoom />
      </Container>
    </Page>
  );
}

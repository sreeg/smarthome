import { Box, Container, Title, Group } from '@mantine/core';
import Page from '../components/Page';
import KidsRoom from '../components/_dashboard/kids';
import { Icon } from '@iconify/react';
import kids from '@iconify/icons-mdi/kids-room';
import sidebarConfig from '../layouts/dashboard/SidebarConfig';

export default function Kids() {
  return (
    <Page title="Kids Room">
      <Container size="xl">
        <Group mb="sm">
          <Icon icon={kids} width={24} height={24} />
          <Title order={2}>Kids Room</Title>
        </Group>

        <KidsRoom />
      </Container>
    </Page>
  );
}

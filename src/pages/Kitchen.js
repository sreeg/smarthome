import { Box, Container, Title, Group } from '@mantine/core';
import Page from '../components/Page';
import KitchenRoom from '../components/_dashboard/kitchen';
import { Icon } from '@iconify/react';
import kitchen from '@iconify/icons-mdi/kitchen-counter';
import sidebarConfig from '../layouts/dashboard/SidebarConfig';

export default function Kitchen() {
  return (
    <Page title="Kitchen">
      <Container size="xl">
        <Group mb="sm">
          <Icon icon={kitchen} width={24} height={24} />
          <Title order={2}>Kitchen</Title>
        </Group>

        <KitchenRoom />
      </Container>
    </Page>
  );
}

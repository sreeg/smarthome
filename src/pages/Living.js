import { Box, Container, Title, Group } from '@mantine/core';
import Page from '../components/Page';
import Livingroom from '../components/_dashboard/living';
import { mdiSofa } from '@mdi/js';
import Iconm from '@mdi/react';
import sidebarConfig from './../layouts/dashboard/SidebarConfig';

export default function Living() {
  return (
    <Page title="Living">
      <Container size="xl">
        <Group mb="sm">
          <Iconm path={mdiSofa} width={22} height={22} />
          <Title order={2}>Living</Title>
        </Group>

        <Livingroom />
      </Container>
    </Page>
  );
}

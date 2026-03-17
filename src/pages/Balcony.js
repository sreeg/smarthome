import { Box, Container, Title, Group } from '@mantine/core';
import Page from '../components/Page';
import BalconyRoom from '../components/_dashboard/balcony';
import { mdiFoodForkDrink } from '@mdi/js';
import Iconm from '@mdi/react';
import sidebarConfig from './../layouts/dashboard/SidebarConfig';

export default function Balcony() {
  return (
    <Page title="Dining & Balcony">
      <Container size="xl">
        <Group mb="sm">
          <Iconm path={mdiFoodForkDrink} width={22} height={22} />
          <Title order={2}>Dining & Balcony</Title>
        </Group>

        <BalconyRoom />
      </Container>
    </Page>
  );
}

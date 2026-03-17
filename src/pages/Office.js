import { Box, Container, Title, Group } from '@mantine/core';
import Page from '../components/Page';
import OfficeRoom from '../components/_dashboard/office';
import { Icon } from '@iconify/react';
import monitorFill from '@iconify/icons-eva/monitor-fill';
import sidebarConfig from './../layouts/dashboard/SidebarConfig';

export default function Office() {
  return (
    <Page title="Office">
      <Container size="xl">
        <Group mb="sm">
          <Icon icon={monitorFill} width={24} height={24} />
          <Title order={2}>Office Room</Title>
        </Group>

        <OfficeRoom />
      </Container>
    </Page>
  );
}

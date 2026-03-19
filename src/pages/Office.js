import { Box, Container, Title, Group, Paper } from '@mantine/core';
import Page from '../components/Page';
import OfficeRoom from '../components/_dashboard/office';
import Temperature from '../components/_dashboard/temperature';
import { Icon } from '@iconify/react';
import monitorFill from '@iconify/icons-eva/monitor-fill';
import sidebarConfig from './../layouts/dashboard/SidebarConfig';

export default function Office() {
  return (
    <Page title="Office">
      <Container size="xl">
        <Group justify="space-between" mb="sm" align="center">
          <Group>
            <Icon icon={monitorFill} width={24} height={24} />
            <Title order={2}>Office Room</Title>
          </Group>
          <Paper p="sm" radius="md" withBorder shadow="sm">
            <Temperature room="office" />
          </Paper>
        </Group>

        <OfficeRoom />
      </Container>
    </Page>
  );
}

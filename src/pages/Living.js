// material
import { Box, Grid, Container, Typography, Button } from '@mui/material';
// components
import Page from '../components/Page';
import Livingroom from '../components/_dashboard/living';
import { mdiSofa } from '@mdi/js';
import Iconm from '@mdi/react';
import NTabs from './../components/NavSectionTab';
import sidebarConfig from './../layouts/dashboard/SidebarConfig';

export default function Living() {
  return (
    <Page title="Living">
      <Container maxWidth="xl">
        <Box style={{ display: 'flex', alignItems: 'center' }} sx={{ pb: 1 }}>
        <Iconm path={mdiSofa} width={22} height={22} />
          <Typography style={{ display: 'inline', marginLeft: '8px' }} variant="h4">Living</Typography>
        </Box>
        <NTabs navConfig={sidebarConfig} style={{marginBottom: 24}}/>
        <Livingroom />
      </Container>
    </Page>
  );
}

// material
import { Box, Grid, Container, Typography, Button } from '@mui/material';
// components
import Page from '../components/Page';
import BedRoom from '../components/_dashboard/bedroom';
import { InlineIcon } from '@iconify/react';
import bed from '@iconify/icons-mdi/bed';
import NTabs from './../components/NavSectionTab';
import sidebarConfig from './../layouts/dashboard/SidebarConfig';
// ----------------------------------------------------------------------

export default function Office() {
  return (
    <Page title="Bedroom">
      <Container maxWidth="xl">
        <Box style={{ display: 'flex', alignItems: 'center' }} sx={{ pb: 1 }}>
          <InlineIcon width={'24'} icon={bed} />
          <Typography style={{ display: 'inline', marginLeft: '8px' }} variant="h4">
            Bed Room
          </Typography>
        </Box>
        <NTabs navConfig={sidebarConfig} style={{marginBottom: 24}}/>
        <BedRoom />
      </Container>
    </Page>
  );
}

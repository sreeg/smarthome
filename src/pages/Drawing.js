// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import DrawingRoom from '../components/_dashboard/drawing';
import { Icon, InlineIcon } from '@iconify/react';
import tvFill from '@iconify/icons-eva/tv-fill';
import NTabs from './../components/NavSectionTab';
import sidebarConfig from './../layouts/dashboard/SidebarConfig';
// ----------------------------------------------------------------------

export default function Drawing() {
  return (
    <Page title="Drawing room">
      <Container maxWidth="xl">
        <Box style={{ display: 'flex', alignItems: 'center' }} sx={{ pb: 1 }}>
          <InlineIcon width={'24'} icon={tvFill} />
          <Typography style={{ display: 'inline', marginLeft: '8px' }} variant="h4">
            Drawing Room
          </Typography>
        </Box>
        <NTabs navConfig={sidebarConfig} style={{marginBottom: 24}}/>
        <DrawingRoom />
      </Container>
    </Page>
  );
}

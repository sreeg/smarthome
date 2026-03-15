import { Box, Grid, Container, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Page from '../components/Page';
import React from 'react';
import Scenes from '../components/_dashboard/Scenes';
import Temperature from '../components/_dashboard/temperature';
import DoorSensor from '../components/_dashboard/doorsensors';
import NTabs from './../components/NavSectionTab';
import sidebarConfig from './../layouts/dashboard/SidebarConfig';
import Fan from '../components/_dashboard/common/Fan';
import Switch from '../components/_dashboard/common/Switch';
import ActiveDevices from '../components/_dashboard/common/ActiveDevices';
import { mdiWaterBoiler, mdiAirConditioner } from '@mdi/js';
import { decodeHtml } from './../utils/commons';
import ColorAndBrightness from '../components/_dashboard/common/ColorAndBrightness';
import Button from '@mui/material/Button';
import Icon from '@mdi/react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';

const gateway = 'http://192.168.88.122:1880';

class DashboardApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      mfan: 'OFF',
      mfanspeed: 5,
      kfan: 'OFF',
      kfanspeed: 5,
      lfan: 'OFF',
      lfanspeed: 5,
      dfan: 'OFF',
      dfanspeed: 5,
      ofan: 'OFF',
      ofanspeed: 5,
      mgyser: 'OFF',
      kgyser: 'OFF',
      ogyser: 'OFF',
      updateTimer: 0,
      open: false,
      fullscreen: false
    };
  }

  stateHandler(obj, val) {
    this.setState({
      [obj]: val
    });
  }
  handleClose = (e) => {
    this.setState({ open: false });
  }
  handleSettings = (e) => {
    this.setState({ open: true });
  }
  routeChange(e) {
    window.location.href = '/dashboard/' + e;
  }
  handleAllACOff = (e) => {
    fetch(gateway + '/allacoff/').then((response) => response.json());
  };
  handleAllACOn = (e) => {
    fetch(gateway + '/allacon/').then((response) => response.json());
  };
  componentWillUnmount() {
    clearInterval(this.updateTimer);
  }
  componentDidMount() {
    this.updateTimer = setInterval(() => window.location.reload(), 300000);
    var that = this;
    fetch(gateway + '/ogyserstatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ ogyser: data['2'].power });
      });
    fetch(gateway + '/mgyserstatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ mgyser: data['2'].power });
      });
    fetch(gateway + '/kgyserstatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ kgyser: data['8'].power });
      });
    fetch(gateway + '/oboardtwostatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ ofan: data['1'].power });
        var speed = data['1'].speed;
        this.setState({ ofanspeed: Math.round(speed / 20) });
      });
    fetch(gateway + '/lacboardstatus')
      .then((response) => response.text())
      .then((data) => {
        data = decodeHtml(data);
        data = JSON.parse(data);
        var speed = data['1'].speed;
        this.setState({ lfanspeed: Math.round(speed / 20) });
        this.setState({ lfan: data['1'].power });
      });
    fetch(gateway + '/dboardstatus')
      .then((response) => response.text())
      .then((data) => {
        data = decodeHtml(data);
        data = JSON.parse(data);
        this.setState({ dfan: data['1'].power });
        var speed = data['1'].speed;
        this.setState({ dfanspeed: Math.round(speed / 20) });
      });
    fetch(gateway + '/kboardtwostatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ kfan: data['1'].power });
        var speed = data['1'].speed;
        this.setState({ kfanspeed: Math.round(speed / 20) });
      });
    fetch(gateway + '/mboardtwostatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ mfan: data['1'].power });
        var speed = data['1'].speed;
        this.setState({ mfanspeed: Math.round(speed / 20) });
        this.setState({ loading: false });
      });
  }

  render() {
    var stateHandler = this.stateHandler;
    return (
      <Page title="Myhome E302">
        <Container maxWidth="xl">
          <Box sx={{ pb: 0 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Welcome, E302!</Typography>
          </Box>

          {/* ACTIVE APPLIANCES ROW */}
          <ActiveDevices />

          <NTabs navConfig={sidebarConfig} style={{ marginBottom: 24 }} />

          <Card sx={{ bgcolor: 'background.paper', color: 'text.primary' }} >
            <CardHeader style={{ paddingBottom: "16px" }}
              action={
                <IconButton aria-label="fingerprint" color="success" onClick={this.handleSettings} >
                  <SettingsIcon />
                </IconButton>
              }
              title={
                <Grid container spacing={2} style={{ display: 'flex' }} item xs={12}>
                  <Grid item>
                    <Temperature room="living" />
                  </Grid>
                  <Grid item><DoorSensor room="Main balcony" /></Grid>
                  <Grid item><DoorSensor room="Service balcony" /></Grid>
                </Grid>
              }
            />
          </Card>
          <Dialog
            className='dark-dialog'
            fullScreen={this.state.fullscreen}
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {"Home Settings"}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item>
                  <ColorAndBrightness cDefaultValue={this.state.commoncolor} bDefaultValue={this.state.commonbright} sColor="commoncolor" sBrightness="commonbright" stateHandler={stateHandler.bind(this)} />
                </Grid>
                <Grid item>
                  <Button className='scene-switch' variant="outlined" onClick={this.handleAllACOn} size="large" color="secondary" disableFocusRipple={true}>
                    <div className="content">
                      <label>
                        <Icon path={mdiAirConditioner} size={1.5} />
                        <div>All AC on</div>
                      </label>
                    </div>
                  </Button>
                </Grid>
                <Grid item>
                  <Button className='scene-switch' variant="outlined" onClick={this.handleAllACOff} size="large" color="secondary" disableFocusRipple={true}>
                    <div className="content">
                      <label>
                        <Icon path={mdiAirConditioner} size={1.5} />
                        <div>All AC off</div>
                      </label>
                    </div>
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={this.handleClose}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <>
            {this.state.loading ? (
              <div>Loading</div>
            ) : (
              <>
                <Grid pt={2} pb={2} sm={12}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Fan sVal={this.state.dfan} sFval={this.state.dfanspeed} sID="dfan" sIDFS="dfanspeed" sName="Drawing" stateHandler={stateHandler.bind(this)} />
                    </Grid>
                    <Grid item>
                      <Fan sVal={this.state.mfan} sFval={this.state.mfanspeed} sID="mfan" sIDFS="mfanspeed" sName="Bedroom" stateHandler={stateHandler.bind(this)} />
                    </Grid>
                    <Grid item>
                      <Fan sVal={this.state.lfan} sFval={this.state.lfanspeed} sID="lfan" sIDFS="lfanspeed" sName="Living" stateHandler={stateHandler.bind(this)} />
                    </Grid>
                    <Grid item>
                      <Fan sVal={this.state.kfan} sFval={this.state.kfanspeed} sID="kfan" sIDFS="kfanspeed" sName="Kids" stateHandler={stateHandler.bind(this)} />
                    </Grid>
                    <Grid item>
                      <Fan sVal={this.state.ofan} sFval={this.state.ofanspeed} sID="ofan" sIDFS="ofanspeed" sName="Office" stateHandler={stateHandler.bind(this)} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid pb={2} sm={12}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Switch sVal={this.state.mgyser} sID="mgyser" sIcon={mdiWaterBoiler} sName="Bedroom" stateHandler={stateHandler.bind(this)}></Switch>
                    </Grid>
                    <Grid item>
                      <Switch sVal={this.state.ogyser} sID="ogyser" sIcon={mdiWaterBoiler} sName="Office" stateHandler={stateHandler.bind(this)}></Switch>
                    </Grid>
                    <Grid item>
                      <Switch sVal={this.state.kgyser} sID="kgyser" sIcon={mdiWaterBoiler} sName="Kids" stateHandler={stateHandler.bind(this)}></Switch>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </>
          <Grid sm={12}>
            <Scenes />
          </Grid>
        </Container>
      </Page >
    );
  }
}
export default DashboardApp;

import React from 'react';
import Switch from './../common/Switch';
import Zone from './../common/Zone';
import Fan from './../common/Fan';
import Curtain from './../common/Curtain';
import { mdiMovieOpen, mdiLedStripVariant, mdiWallSconceFlat, mdiTelevision, mdiCoachLamp, mdiVanityLight, mdiStringLights, mdiAirConditioner } from '@mdi/js';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Icon from '@mdi/react';
import { decodeHtml } from './../../../utils/commons';
import AC from './../common/AC';
import ColorAndBrightness from '../common/ColorAndBrightness';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const gateway = 'http://192.168.88.122:1880';
class OfficeRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dfan: 'OFF',
      dcurtainlight: 'OFF',
      dwallwasher: 'OFF',
      dgovee: 'OFF',
      dwalllamp: 'OFF',
      dtv: 'OFF',
      dcenterzone: 'OFF',
      dhallway: 'OFF',
      dtvzone: 'OFF',
      dfanspeed: 5,
      dcolor: 5,
      dbrightness: 5,
      dsheer: 'CLOSE',
      temp: 24,
      dblackout: 'CLOSE',
      updateTimer: 0
    };
  }

  stateHandler(obj, val) {
    this.setState({
      [obj]: val
    });
  }

  handleMovieMode = (e) => {
    fetch(gateway + '/movietime/').then((response) => response.json());
  };

  componentWillUnmount() {
    clearInterval(this.updateTimer);
  }
  componentDidMount() {
    this.fetchData();
    this.updateTimer = setInterval(() => this.fetchData(), 3000);
  }

  fetchData = () => {
    var that = this;
    fetch(gateway + '/dsheercurtainstatus')
      .then((response) => response.text())
      .then((data) => {
        try {
          data = JSON.parse(decodeHtml(data));
          this.setState({ dsheer: data['1'].curtain });
        } catch (e) {
          console.error("Failed to parse sheer curtain status:", e);
        }
      });
    fetch(gateway + '/dblackoutcurtainstatus')
      .then((response) => response.text())
      .then((data) => {
        try {
          data = JSON.parse(decodeHtml(data));
          this.setState({ dblackout: data['1'].curtain });
        } catch (e) {
          console.error("Failed to parse blackout curtain status:", e);
        }
      });
    fetch(gateway + '/dboardmainstatus')
      .then((response) => response.text())
      .then((data) => {
        try {
          data = decodeHtml(data);
          data = JSON.parse(data);
          var speed = data['1'].speed;
          this.setState({ dbrightness: speed });
          speed = data['2'].speed;
          this.setState({ dcolor: speed });
          this.setState({ dcenterzone: data['3'].power });
          this.setState({ dtvzone: data['5'].power });
          this.setState({ dhallway: data['7'].power });
        } catch (e) {
          console.error("Failed to parse main board status:", e);
        }
      });
    fetch(gateway + '/dboardstatus')
      .then((response) => response.text())
      .then((data) => {
        try {
          data = decodeHtml(data);
          data = JSON.parse(data);
          this.setState({ dfan: data['1'].power });
          var speed = data['1'].speed;
          this.setState({ dfanspeed: speed });
          this.setState({ dgovee: data['2'].power });
          this.setState({ dwalllamp: data['4'].power });
          this.setState({ dcurtainlight: data['5'].power });
          this.setState({ dwallwasher: data['6'].power });
          this.setState({ dtv: data['8'].power });
          this.setState({ loading: false });
        } catch (e) {
          console.error("Failed to parse board status:", e);
          this.setState({ loading: false }); // Still exit loading state on error
        }
      });
  }
  render() {
    var stateHandler = this.stateHandler;
    return (
      <>
        {this.state.loading ? (
          <div>Loading</div>
        ) : (
          <Box sx={{ pb: 5 }}>
            <Grid container pb={4} spacing={2} alignItems="center">
              <Grid item>
                <ColorAndBrightness cDefaultValue={this.state.dcolor} bDefaultValue={this.state.dbrightness} sColor="dcolor" sBrightness="dbrightness" stateHandler={stateHandler.bind(this)} />
              </Grid>
               <Grid item>
                <Zone sVal={this.state.dcenterzone} zoneClass="zone33 zone33center" sID="dcenterzone" sIcon={mdiStringLights} sName="Center" stateHandler={stateHandler.bind(this)}></Zone>
              </Grid>
              <Grid item>
                <Zone sVal={this.state.dtvzone} zoneClass="zone33 zone33ac" sID="dtvzone" sIcon={mdiStringLights} sName="TV Light" stateHandler={stateHandler.bind(this)}></Zone>
              </Grid>
              <Grid item>
                <Zone sVal={this.state.dhallway} zoneClass="zone33 zone33left" sID="dhallway" sIcon={mdiStringLights} sName="Hallway" stateHandler={stateHandler.bind(this)}></Zone>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.dwalllamp} sID="dwalllamp" sIcon={mdiCoachLamp} sName="Wall lamp" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.dcurtainlight} sID="dcurtainlight" sIcon={mdiVanityLight} sName="Curtain light" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.dwallwasher} sID="dwallwasher" sIcon={mdiWallSconceFlat} sName="Wall washer" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.dgovee} sID="dgovee" sIcon={mdiLedStripVariant} sName="Govee" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>

              <Grid item>
                <AC className="ac-container" sVal={this.state.temp} sID="DAC" sName="DAC" stateHandler={stateHandler.bind(this)} />
              </Grid>
              <Grid item>
                <Fan sVal={this.state.dfan} sFval={this.state.dfanspeed} sID="dfan" sIDFS="dfanspeed" sName="Fan" stateHandler={stateHandler.bind(this)} />
              </Grid>

              <Grid item>
                <Curtain sVal={this.state.dsheer} sID="dsheer" sName="Sheer curtain" stateHandler={stateHandler.bind(this)}></Curtain>
              </Grid>
              <Grid item>
                <Curtain sVal={this.state.dblackout} sID="dblackout" sName="Blackout curtain" stateHandler={stateHandler.bind(this)}></Curtain>
              </Grid>

              <Grid item>
                <Switch sVal={this.state.dtv} sID="dtv" sIcon={mdiTelevision} sName="TV" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>

              <Grid item>
                <Button className='scene-switch' variant="outlined" onClick={this.handleMovieMode} size="large" color="secondary" disableFocusRipple={true} sx={{
                  borderColor: 'text.disabled', color: 'text.primary', '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' }
                }}>
                  <div className="content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px' }}>
                    <Icon path={mdiMovieOpen} size={2} style={{ marginBottom: '8px' }} />
                    <Typography variant="body2" fontWeight="bold">Movie mode</Typography>
                  </div>
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </>
    );
  }
}
export default OfficeRoom;

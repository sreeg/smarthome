import React from 'react';
import Switch from '../common/Switch';
import Curtain from '../common/Curtain';
import Zone from '../common/Zone';
import Fan from '../common/Fan';
import { mdiLedStripVariant, mdiCoachLamp, mdiWaterBoiler, mdiStringLights, mdiTelevision } from '@mdi/js';
import Grid from '@mui/material/Grid';
import { decodeHtml } from '../../../utils/commons';
import AC from '../common/AC';
import ColorAndBrightness from '../common/ColorAndBrightness';
import Button from '@mui/material/Button';
import { MdBedtime } from 'react-icons/md';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const gateway = 'http://192.168.88.122:1880';
const ICON_HEIGHT = 42;
class BedRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      mfan: 'OFF',
      mlight2: 'OFF',
      mlight3: 'OFF',
      mlight4: 'OFF',
      mcenterzone: 'OFF',
      maczone: 'OFF',
      mwardrobe: 'OFF',
      mwalllamp: 'OFF',
      mtv: 'OFF',
      mtvunderlight: 'OFF',
      mfanspeed: 5,
      mcolor: 5,
      mbrightness: 5,
      mblackout: 'CLOSE',
      mgyser: 'OFF',
      updateTimer: 0
    };
  }

  stateHandler(obj, val) {
    this.setState({
      [obj]: val
    });
  }
  handleBedtime = (e) => {
    fetch(gateway + '/bedtime/').then((response) => response.json());
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
    fetch(gateway + '/mgyserstatus')
      .then((response) => response.text())
      .then((data) => {
        try {
          data = JSON.parse(decodeHtml(data));
          this.setState({ mgyser: data['2'].power });
        } catch (e) {
          console.error("Failed to parse geyser status:", e);
        }
      });
    fetch(gateway + '/mentrancestatus')
      .then((response) => response.text())
      .then((data) => {
        try {
          data = JSON.parse(decodeHtml(data));
          this.setState({ mwalllamp: data['1'].power });
          this.setState({ mwtvunderlight: data['2'].power });
        } catch (e) {
          console.error("Failed to parse entrance status:", e);
        }
      });
    fetch(gateway + '/mblackoutcurtainstatus')
      .then((response) => response.text())
      .then((data) => {
        try {
          data = JSON.parse(decodeHtml(data));
          this.setState({ mblackout: data['1'].curtain });
        } catch (e) {
          console.error("Failed to parse blackout curtain status:", e);
        }
      });
    fetch(gateway + '/mboardmainstatus')
      .then((response) => response.text())
      .then((data) => {
        try {
          data = JSON.parse(decodeHtml(data));
          var speed = data['1'].speed;
          this.setState({ mbrightness: speed });
          speed = data['2'].speed;
          this.setState({ mcolor: speed });
          this.setState({ maczone: data['5'].power });
          this.setState({ mcenterzone: data['3'].power });
          this.setState({ mwardrobe: data['7'].power });
        } catch (e) {
          console.error("Failed to parse main board status:", e);
        }
      });
    fetch(gateway + '/mtvboardstatus')
      .then((response) => response.text())
      .then((data) => {
        try {
          data = JSON.parse(decodeHtml(data));
          this.setState({ mtv: data['2'].power });
          this.setState({ mtvunderlight: data['3'].power });
        } catch (e) {
          console.error("Failed to parse TV board status:", e);
        } finally {
          this.setState({ loading: false });
        }
      });
    fetch(gateway + '/mboardtwostatus')
      .then((response) => response.text())
      .then((data) => {
        try {
          data = JSON.parse(decodeHtml(data));
          this.setState({ mfan: data['1'].power });
          var speed = data['1'].speed;
          this.setState({ mfanspeed: speed });
          this.setState({ mlight2: data['2'].power });
          this.setState({ mlight3: data['3'].power });
          this.setState({ mlight4: data['4'].power });
        } catch (e) {
          console.error("Failed to parse board two status:", e);
        } finally {
          this.setState({ loading: false });
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
            <Grid pb={4} container spacing={2} alignItems="center">
              <Grid item>
                <ColorAndBrightness cDefaultValue={this.state.mcolor} bDefaultValue={this.state.mbrightness} sColor="mcolor" sBrightness="mbrightness" stateHandler={stateHandler.bind(this)} />
              </Grid>
              <Grid item>
                <Zone sVal={this.state.maczone} zoneClass="zone23 zone23top" sID="maczone" sIcon={mdiStringLights} sName="AC Zone" stateHandler={stateHandler.bind(this)}></Zone>
              </Grid>
              <Grid item>
                <Zone sVal={this.state.mcenterzone} zoneClass="zone23 zone23center" sID="mcenterzone" sIcon={mdiStringLights} sName="Center" stateHandler={stateHandler.bind(this)}></Zone>
              </Grid>
              <Grid item>
                <Zone sVal={this.state.mwardrobe} zoneClass="zone23 zone23center" sID="mwardrobe" sIcon={mdiStringLights} sName="Wardrobe" stateHandler={stateHandler.bind(this)}></Zone>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.mwalllamp} sID="mwalllamp" sIcon={mdiCoachLamp} sName="Wall lamp" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.mtvunderlight} sID="mtvunderlight" sIcon={mdiLedStripVariant} sName="TV light" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>

               <Grid item>
                <AC sVal={this.state.temp} sID="BAC" sName="BAC" stateHandler={stateHandler.bind(this)} />
              </Grid>
              <Grid item>
                <Fan sVal={this.state.mfan} sFval={this.state.mfanspeed} sID="mfan" sIDFS="mfanspeed" sName="Fan" stateHandler={stateHandler.bind(this)} />
              </Grid>

              <Grid item>
                <Curtain sVal={this.state.mblackout} sID="mblackout" sName="Blackout curtain" stateHandler={stateHandler.bind(this)}></Curtain>
              </Grid>

              <Grid item>
                <Switch sVal={this.state.mtv} sID="mtv" sIcon={mdiTelevision} sName="TV" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.mgyser} sID="mgyser" sIcon={mdiWaterBoiler} sName="Geyser" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>

              <Grid item>
                <Button className='scene-switch' variant="outlined" onClick={this.handleBedtime} size="large" color="secondary" disableFocusRipple={true} sx={{
                  borderColor: 'text.disabled', color: 'text.primary', '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' }
                }}>
                  <div className="content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px' }}>
                    <MdBedtime size={ICON_HEIGHT} style={{ marginBottom: '8px' }} />
                    <Typography variant="body2" fontWeight="bold">Bedtime</Typography>
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
export default BedRoom;

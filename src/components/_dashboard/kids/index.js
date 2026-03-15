import React from 'react';
import Switch from '../common/Switch';
import SwitchCustomIcon from '../common/SwitchCustomIcon';
import Curtain from '../common/Curtain';
import Zone from '../common/Zone';
import Fan from '../common/Fan';
import { mdiLamp, mdiCoachLamp, mdiWaterBoiler, mdiStringLights } from '@mdi/js';
import { GiElectricalSocket } from 'react-icons/gi';
import Grid from '@mui/material/Grid';
import { decodeHtml } from '../../../utils/commons';
import ColorAndBrightness from '../common/ColorAndBrightness';

const gateway = 'http://192.168.88.122:1880';
class Kids extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      kfan: 'OFF',
      kcenterzone: 'OFF',
      kaczone: 'OFF',
      kwardrobe: 'OFF',
      kwalllamp: 'OFF',
      klight2: 'OFF',
      klight4: 'OFF',
      kfanspeed: 5,
      kcolor: 5,
      kbrightness: 5,
      kblackout: 'CLOSE',
      kgyser: 'OFF',
      ktablelamp: 'OFF',
      ksocket1: 'OFF',
      ksocketwardrobe: 'OFF',
      updateTimer: 0
    };
  }

  stateHandler(obj, val) {
    this.setState({
      [obj]: val
    });
  }

  componentWillUnmount() {
    clearInterval(this.updateTimer);
  }
  componentDidMount() {
    this.updateTimer = setInterval(() => window.location.reload(), 300000);
    var that = this;
    fetch(gateway + '/kgyserstatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ ksocketwardrobe: data['7'].power });
        this.setState({ kgyser: data['8'].power });
      });
    fetch(gateway + '/kblackoutcurtainstatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ kblackout: data['1'].curtain });
      });
    fetch(gateway + '/ksbstatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ kwalllamp: data['1'].power });
        this.setState({ ksocket1: data['2'].power });
      });
    fetch(gateway + '/kboardmainstatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        var speed = data['1'].speed;
        this.setState({ kbrightness: Math.round(speed / 20) });
        speed = data['2'].speed;
        this.setState({ kcolor: Math.round(speed / 20) });
        this.setState({ kaczone: data['5'].power });
        this.setState({ kcenterzone: data['3'].power });
        this.setState({ kwardrobe: data['7'].power });
      });
    fetch(gateway + '/kboardtwostatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ kfan: data['1'].power });
        var speed = data['1'].speed;
        this.setState({ kfanspeed: Math.round(speed / 20) });
        this.setState({ klight2: data['2'].power });
        this.setState({ kwalllamp: data['3'].power });
        this.setState({ klight4: data['4'].power });
        this.setState({ loading: false });
      });
  }
  render() {
    var stateHandler = this.stateHandler;
    return (
      <>
        {this.state.loading ? (
          <div>Loading</div>
        ) : (
          <>
            <Grid pb={3} container spacing={2}>
              <Grid item>
                <ColorAndBrightness cDefaultValue={this.state.kcolor} bDefaultValue={this.state.kbrightness} sColor="kcolor" sBrightness="kbrightness" stateHandler={stateHandler.bind(this)} />
              </Grid>
              <Grid item>
                <Zone sVal={this.state.kaczone} zoneClass="zone23 zone23top" sID="kaczone" sIcon={mdiStringLights} sName="AC" stateHandler={stateHandler.bind(this)}></Zone>
              </Grid>
              <Grid item>
                <Zone sVal={this.state.kcenterzone} zoneClass="zone23 zone23center" sID="kcenterzone" sIcon={mdiStringLights} sName="Center" stateHandler={stateHandler.bind(this)}></Zone>
              </Grid>
              <Grid item>
                <Zone sVal={this.state.kwardrobe} zoneClass="zone23 zone23center" sID="kwardrobe" sIcon={mdiStringLights} sName="Wardrobe" stateHandler={stateHandler.bind(this)}></Zone>
              </Grid>
              <Grid item>
                <Fan sVal={this.state.kfan} sFval={this.state.kfanspeed} sID="kfan" sIDFS="kfanspeed" sName="Fan" stateHandler={stateHandler.bind(this)} />
              </Grid>
            </Grid>

            <Grid pb={3} container spacing={2}>
              <Grid item>
                <Switch sVal={this.state.kwalllamp} sID="kwalllamp" sIcon={mdiCoachLamp} sName="Wall lamp" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.kgyser} sID="kgyser" sIcon={mdiWaterBoiler} sName="Gyser" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.ktablelamp} sID="ktablelamp" sIcon={mdiLamp} sName="Table Lamp" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              <Grid item>
                <SwitchCustomIcon sVal={this.state.ksocket1} sID="ksocket1" sIcon={GiElectricalSocket} sName="Socket 1" stateHandler={stateHandler.bind(this)}></SwitchCustomIcon>
              </Grid>
              <Grid item>
                <SwitchCustomIcon sVal={this.state.ksocketwardrobe} sID="ksocketwardrobe" sIcon={GiElectricalSocket} sName="Socket Wardrobe" stateHandler={stateHandler.bind(this)}></SwitchCustomIcon>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item>
                <Curtain sVal={this.state.kblackout} sID="kblackout" sName="Blackout curtain" stateHandler={stateHandler.bind(this)}></Curtain>
              </Grid>
            </Grid>
          </>
        )}
      </>
    );
  }
}
export default Kids;

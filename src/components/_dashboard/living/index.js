import React from 'react';
import Switch from '../common/Switch';
import ColorAndBrightness from '../common/ColorAndBrightness';
import SwitchCustomIcon from '../common/SwitchCustomIcon';
import Zone from '../common/Zone';
import Curtain from '../common/Curtain';
import Fan from '../common/Fan';
import { mdiTelevision, mdiEiffelTower } from '@mdi/js';
import Grid from '@mui/material/Grid';
import { decodeHtml } from '../../../utils/commons';
import { GiDoubleStreetLights, GiCeilingLight, GiTheaterCurtains, GiScallop, GiDjedPillar } from 'react-icons/gi';
import AC from '../common/AC';

const gateway = 'http://192.168.88.122:1880';
class Living extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      lcolor: 5,
      lbrightness: 5,
      lsheer: 'CLOSE',
      lblackout: 'CLOSE',
      lcenterzone: 'OFF',
      lhallway: 'OFF',
      laczone: 'OFF',
      lfloorlamp: 'OFF',
      ltv: 'OFF',
      ldigitalclock: 'OFF',
      lcurtainlight: 'OFF',
      lscallop: 'OFF',
      lfanspeed: 5,
      lfan: 'OFF',
      livingtvsocket: 'OFF',
      lfloorikea: 'OFF',
      lAC: 'OFF',
      temp: 24,
      updateTimer: 0
    };
  }

  stateHandler(obj, val) {
    this.setState({
      [obj]: val
    });
  }
  handleCozyMode = (e) => {
    fetch(gateway + '/dinningcozy/').then((response) => response.json());
  };

  componentWillUnmount() {
    clearInterval(this.updateTimer);
  }
  componentDidMount() {
    this.updateTimer = setInterval(() => window.location.reload(), 300000);
    var that = this;
    fetch(gateway + '/lsheercurtainstatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ lsheer: data['1'].curtain });
      });
    fetch(gateway + '/lblackoutcurtainstatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ lblackout: data['1'].curtain });
      });
    fetch(gateway + '/ltvboardstatus')
      .then((response) => response.text())
      .then((data) => {
        data = decodeHtml(data);
        data = JSON.parse(data);
        this.setState({ ltv: data['4'].power });
        this.setState({ ldigitalclock: data['3'].power });
        this.setState({ lfloorlamp: data['2'].power });
        this.setState({ livingtvsocket: data['1'].power });
      });
    fetch(gateway + '/lacboardstatus')
      .then((response) => response.text())
      .then((data) => {
        data = decodeHtml(data);
        data = JSON.parse(data);
        var speed = data['1'].speed;
        this.setState({ lfanspeed: Math.round(speed / 20) });
        this.setState({ lfan: data['1'].power });
        this.setState({ lscallop: data['5'].power });
      });
    fetch(gateway + '/lboardtwostatus')
      .then((response) => response.text())
      .then((data) => {
        data = decodeHtml(data);
        data = JSON.parse(data);
        this.setState({ lcurtainlight: data['1'].power });
      });
      // fetch(gateway + '/threelightstatus')
      // .then((response) => response.text())
      // .then((data) => {
      //   data = decodeHtml(data);
      //   console.log(data);
      //   data = JSON.parse(data);
        
      //   this.setState({ lfloorikea: data });
      // });
    fetch(gateway + '/lboardmainstatus')
      .then((response) => response.text())
      .then((data) => {
        data = decodeHtml(data);
        data = JSON.parse(data);
        var speed = data['1'].speed;
        this.setState({ lbrightness: Math.round(speed / 20) });
        speed = data['2'].speed;
        this.setState({ lcolor: Math.round(speed / 20) });
        this.setState({ lcenterzone: data['5'].power });
        this.setState({ lhallway: data['3'].power });
        this.setState({ laczone: data['7'].power });
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
            <Grid container spacing={2} pb={3}>
              <Grid item>
                <ColorAndBrightness cDefaultValue={this.state.lcolor} bDefaultValue={this.state.lbrightness} sColor="lcolor" sBrightness="lbrightness" stateHandler={stateHandler.bind(this)} />
              </Grid>
              <Grid item>
                <Zone sVal={this.state.laczone} zoneClass="zone33 zone33ac" sID="laczone" sName="AC" stateHandler={stateHandler.bind(this)}></Zone>
              </Grid>
              <Grid item>
                <Zone sVal={this.state.lcenterzone} zoneClass="zone33 zone33center" sID="lcenterzone" sName="Center" stateHandler={stateHandler.bind(this)}></Zone>
              </Grid>
              <Grid item>
                <Zone sVal={this.state.lhallway} zoneClass="zone33 zone33left" sID="lhallway" sName="Hallway" stateHandler={stateHandler.bind(this)}></Zone>
              </Grid>
              <Grid item>
                <Fan sVal={this.state.lfan} sFval={this.state.lfanspeed} sID="lfan" sIDFS="lfanspeed" sName="Fan" stateHandler={stateHandler.bind(this)} />
              </Grid>
            </Grid>

            <Grid container pb={3} spacing={2}>
              <Grid item>
                <SwitchCustomIcon sVal={this.state.lscallop} sID="lscallop" sIcon={GiScallop} sName="Scallop" stateHandler={stateHandler.bind(this)}></SwitchCustomIcon>
              </Grid>
              <Grid item>
                <SwitchCustomIcon sVal={this.state.lcurtainlight} sID="lcurtainlight" sIcon={GiTheaterCurtains} sName="Curtain light" stateHandler={stateHandler.bind(this)}></SwitchCustomIcon>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.ldigitalclock} sID="ldigitalclock" sIcon={mdiEiffelTower} sName="Eiffel Tower" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.ltv} sID="ltv" sIcon={mdiTelevision} sName="Frame TV" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              <Grid item>
                <SwitchCustomIcon sVal={this.state.lfloorlamp} sID="lfloorlamp" sIcon={GiDjedPillar} sName="Floor lamp" stateHandler={stateHandler.bind(this)}></SwitchCustomIcon>
              </Grid>
              <Grid item>
                <SwitchCustomIcon sVal={this.state.livingtvsocket} sID="livingtvsocket" sIcon={GiCeilingLight} sName="Cabnet light" stateHandler={stateHandler.bind(this)}></SwitchCustomIcon>
              </Grid>
              <Grid item>
                <SwitchCustomIcon sVal={this.state.lfloorikea} sID="lfloorikea" sIcon={GiDoubleStreetLights} sName="Ikea Floor light" stateHandler={stateHandler.bind(this)}></SwitchCustomIcon>
              </Grid>
            </Grid>

            <Grid container pb={1} spacing={2}>
              <Grid item>
                <Curtain sVal={this.state.lsheer} sID="lsheer" sName="Sheer curtain" stateHandler={stateHandler.bind(this)}></Curtain>
              </Grid>
              <Grid item>
                <Curtain sVal={this.state.lblackout} sID="lblackout" sName="Blackout curtain" stateHandler={stateHandler.bind(this)}></Curtain>
              </Grid>
            </Grid>

            <AC sVal={this.state.temp} sID="lAC" sName="lAC" stateHandler={stateHandler.bind(this)} />
          </>
        )}
      </>
    );
  }
}
export default Living;

import React from 'react';
import Switch from '../common/Switch';
import SwitchCustomIcon from '../common/SwitchCustomIcon';
import Zone from '../common/Zone';
import Curtain from '../common/Curtain';
import { mdiStringLights, mdiChandelier, mdiOm } from '@mdi/js';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { decodeHtml } from '../../../utils/commons';
import { mdiHandsPray } from '@mdi/js';
import { GiByzantinTemple, GiElectricalSocket, GiCandleFlame } from 'react-icons/gi';
import { FaFan } from 'react-icons/fa';
import { MdBalcony } from 'react-icons/md';
import { mdiPipeValve } from '@mdi/js';
import ColorAndBrightness from '../common/ColorAndBrightness';

const gateway = 'http://192.168.88.122:1880';
class BalconyArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      bchandlier: 'OFF',
      poojaroompanel: 'OFF',
      poojaomlight: 'OFF',
      dlight1: 'OFF',
      dlight2: 'OFF',
      dinningcenterzone: 'OFF',
      dinningaczone: 'OFF',
      poojaroom: 'OFF',
      bcolor: 5,
      bbrightness: 5,
      bsheer: 'CLOSE',
      bblackout: 'CLOSE',
      bzone: 'OFF',
      bexhaust: 'OFF',
      bsocket: 'OFF',
      balconyzone: 'OFF',
      bsocket: 'OFF',
      bexhaust: 'OFF',
      bvalve: 'OFF'
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

  componentDidMount() {
    var that = this;
    fetch(gateway + '/bboardstatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ balconyzone: data['3'].power });
      });
    fetch(gateway + '/bboardtwostatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ bsocket: data['1'].power });
        this.setState({ bexhaust: data['2'].power });
      });
    fetch(gateway + '/bsheercurtainstatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ bsheer: data['1'].curtain });
      });
    fetch(gateway + '/bblackoutcurtainstatus')
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ bblackout: data['1'].curtain });
      });
    fetch(gateway + '/dinningboardstatus')
      .then((response) => response.text())
      .then((data) => {
        data = decodeHtml(data);
        data = JSON.parse(data);
        var speed = data['1'].speed;
        this.setState({ bbrightness: Math.round(speed / 20) });
        speed = data['2'].speed;
        this.setState({ bcolor: Math.round(speed / 20) });
        this.setState({ dinningcenterzone: data['5'].power });
        this.setState({ poojaroom: data['7'].power });
        this.setState({ dinningaczone: data['3'].power });
      });
    fetch(gateway + '/poojaboardstatus')
      .then((response) => response.text())
      .then((data) => {
        data = decodeHtml(data);
        data = JSON.parse(data);
        this.setState({ poojaroompanel: data['1'].power });
        this.setState({ poojaroomunderlight: data['2'].power });
      });
    fetch(gateway + '/dinningboardtwostatus')
      .then((response) => response.text())
      .then((data) => {
        data = decodeHtml(data);
        data = JSON.parse(data);
        this.setState({ dlight1: data['1'].power });
        this.setState({ dlight2: data['2'].power });
        this.setState({ bchandlier: data['4'].power });
        this.setState({ dlight3: data['3'].power });
        this.setState({ loading: false });
      });
    fetch(gateway + '/watervalvestatus')
      .then((response) => response.text())
      .then((data) => {
        try {
          data = JSON.parse(decodeHtml(data));
          this.setState({ bvalve: data.state || 'OFF' });
        } catch (e) {
          console.error("Failed to parse water valve status:", data);
        }
      })
      .catch((err) => console.error("Fetch error for water valve status:", err));
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
                <ColorAndBrightness cDefaultValue={this.state.dinningcolor} bDefaultValue={this.state.dinningbrightness} sColor="dinningcolor" sBrightness="dinningbrightness" stateHandler={stateHandler.bind(this)} />
              </Grid>
              <Grid item>
                <Zone sVal={this.state.dinningaczone} zoneClass="zone33 zone33left" sID="dinningaczone" sIcon={mdiStringLights} sName="AC" stateHandler={stateHandler.bind(this)}></Zone>
              </Grid>
              <Grid item>
                <Zone sVal={this.state.dinningcenterzone} zoneClass="zone33 zone33center" sID="dinningcenterzone" sIcon={mdiStringLights} sName="Center" stateHandler={stateHandler.bind(this)}></Zone>
              </Grid>
            </Grid>

            <Grid pb={3} container spacing={2}>
              <Grid item>
                <Switch sVal={this.state.poojaroom} sID="poojaroom" sIcon={mdiHandsPray} sName="Pooja" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              <Grid item>
                <SwitchCustomIcon sVal={this.state.balconyzone} sID="balconyzone" sIcon={MdBalcony} sName="Balcony" stateHandler={stateHandler.bind(this)}></SwitchCustomIcon>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.bchandlier} sID="bchandlier" sIcon={mdiChandelier} sName="Chandlier" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              <Grid item>
                <SwitchCustomIcon sVal={this.state.poojaroompanel} sID="poojaroompanel" sIcon={GiByzantinTemple} sName="Panel light" stateHandler={stateHandler.bind(this)}></SwitchCustomIcon>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.poojaroomunderlight} sID="poojaroomunderlight" sIcon={mdiChandelier} sName="Under light" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.poojaomlight} sID="poojaomlight" sIcon={mdiOm} sName="Om light" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              <Grid item>
                <SwitchCustomIcon sVal={this.state.bsocket} sID="bsocket" sIcon={GiElectricalSocket} sName="Balcony socket" stateHandler={stateHandler.bind(this)}></SwitchCustomIcon>
              </Grid>
              <Grid item>
                <SwitchCustomIcon sVal={this.state.bexhaust} sID="bexhaust" sIcon={FaFan} sName="Balcony exhaust" stateHandler={stateHandler.bind(this)}></SwitchCustomIcon>
              </Grid>
              <Grid item>
                <Switch sVal={this.state.bvalve} sID="bvalve" sIcon={mdiPipeValve} sName="Water valve" stateHandler={stateHandler.bind(this)}></Switch>
              </Grid>
              {/* <Grid item>
                    <Switch sVal={this.state.dlight1} sID="dlight1" sIcon={mdiLightbulbVariantOutline} sName="Dinning light 1" stateHandler={stateHandler.bind(this)}></Switch>
                  </Grid>
                  <Grid item>
                    <Switch sVal={this.state.dlight2} sID="dlight2" sIcon={mdiLightbulbVariantOutline} sName="Dinning light 2" stateHandler={stateHandler.bind(this)}></Switch>
                  </Grid>
                  <Grid item>
                    <Switch sVal={this.state.dlight3} sID="dlight3" sIcon={mdiLightbulbVariantOutline} sName="Dinning light 3" stateHandler={stateHandler.bind(this)}></Switch>
                  </Grid> */}
            </Grid>

            <Grid pb={3} container spacing={2}>
              <Grid item>
                <Curtain sVal={this.state.bsheer} sID="bsheer" sName="Sheer curtain" stateHandler={stateHandler.bind(this)}></Curtain>
              </Grid>
              <Grid item>
                <Curtain sVal={this.state.bblackout} sID="bblackout" sName="Blackout curtain" stateHandler={stateHandler.bind(this)}></Curtain>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <Button className="scene-switch" variant="outlined" onClick={this.handleCozyMode} size="large" color="secondary" disableFocusRipple={true}>
                <div className="content">
                  <GiCandleFlame size={48} />
                  <div>Cozy mode</div>
                </div>
              </Button>
            </Grid>
          </>
        )}
      </>
    );
  }
}
export default BalconyArea;

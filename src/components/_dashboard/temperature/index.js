import React from 'react';
import { decodeHtml } from '../../../utils/commons';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'react-circular-progressbar/dist/styles.css';
import Icon from '@mdi/react';
import { mdiThermometer, mdiWaterPercent } from '@mdi/js';

const gateway = 'http://192.168.88.122:1880';
class Temperature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      temperature: 'OFF',
      humidity: 'OFF'
    };
  }

  componentDidMount() {
    var that = this;
    var room = '/livingtemp';
    if (this.props.room === 'office') {
      room = '/officetemp';
    }
    fetch(gateway + room)
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        console.log(data);
        this.setState({ temperature: data.temperature });
        this.setState({ humidity: data.humidity });
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
            <div style={{ display: 'flex', flexDirection: 'row' }} className="content-temparature">
              <Icon path={mdiThermometer} size={1} />
              <h1 style={{ fontSize: "16px" }}>{this.state.temperature}°C</h1>
              <Icon path={mdiWaterPercent} size={1} />
              <h1 style={{ fontSize: "16px" }}>{this.state.humidity}%</h1>
            </div>
          </>
        )}
      </>
    );
  }
}
export default Temperature;

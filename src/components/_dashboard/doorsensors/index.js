import React from 'react';
import Icon from '@mdi/react';
import { decodeHtml } from '../../../utils/commons';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'react-circular-progressbar/dist/styles.css';
import { mdiDoorSlidingOpen, mdiDoorSliding } from '@mdi/js';

const gateway = 'http://192.168.88.122:1880';
const MIN_WIDTH = 125;
class DoorSensors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      roomName: "",
      contact: "false"
    };
  }

  componentDidMount() {
    var that = this;
    var room = '/balconydoorsensor';
    console.log(this.props.room);
    if (this.props.room === 'Service balcony') {
      room = '/servicebalconydoorsensor';
    }
    fetch(gateway + room)
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(decodeHtml(data));
        this.setState({ contact: data.contact + '' });
        this.setState({ roomName: that.props.room });
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log(error)
    });
  }
  render() {
    return (
      <>
        {this.state.loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'row', minWidth: MIN_WIDTH }} className="content-sensors">
              <p style={{ margin: "0 8px" }}>{this.state.roomName}</p>
              <>
                {this.state.contact === 'false' ? (
                  <Icon color='red' path={mdiDoorSlidingOpen} size={1} />) : (
                  <Icon color='green' path={mdiDoorSliding} size={1} />
                )}
              </>
            </div>
          </>
        )}
      </>
    );
  }
}
export default DoorSensors;

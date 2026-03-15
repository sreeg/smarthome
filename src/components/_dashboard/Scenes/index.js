import React from 'react';
import { mdiMovieOpen } from '@mdi/js';
import { GiExitDoor, GiEntryDoor, GiCandleFlame } from 'react-icons/gi';
import { MdBedtime } from 'react-icons/md';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Icon from '@mdi/react';

const gateway = 'http://192.168.88.122:1880';
const ICON_HEIGHT = 42;

class Scenes extends React.Component {
  constructor(props) {
    super(props);
  }
  handleMovieMode = (e) => {
    fetch(gateway + '/movietime/').then((response) => response.json());
  };

  handleCozyMode = (e) => {
    fetch(gateway + '/dinningcozy/').then((response) => response.json());
  };
  handleBedtime = (e) => {
    fetch(gateway + '/bedtime/').then((response) => response.json());
  };
  render() {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item>
            <Button className="scene-switch" variant="outlined" onClick={this.handleMovieMode} size="large" color="secondary" disableFocusRipple={true}>
              <div className="content">
                <label>
                  <Icon path={mdiMovieOpen} size={1.5} />
                  <div>Movie mode</div>
                </label>
              </div>
            </Button>
          </Grid>
          <Grid item>
            <Button className="scene-switch" variant="outlined" onClick={this.handleCozyMode} size="large" color="secondary" disableFocusRipple={true}>
              <div className="content">
                <label>
                  <GiCandleFlame size={ICON_HEIGHT} />
                  <div>Cozy mode</div>
                </label>
              </div>
            </Button>
          </Grid>
          <Grid item>
            <Button className="scene-switch" variant="outlined" onClick={this.handleBedtime} size="large" color="secondary" disableFocusRipple={true}>
              <div className="content">
                <label>
                  <MdBedtime size={ICON_HEIGHT} />
                  <div>Bedtime</div>
                </label>
              </div>
            </Button>
          </Grid>
          <Grid item>
            <Button className="scene-switch" variant="outlined" onClick={this.handleCozyMode} size="large" color="secondary" disableFocusRipple={true}>
              <div className="content">
                <label>
                  <GiEntryDoor size={ICON_HEIGHT} />
                  <div>Home entry</div>
                </label>
              </div>
            </Button>
          </Grid>
          <Grid item>
            <Button className="scene-switch" variant="outlined" onClick={this.handleCozyMode} size="large" color="secondary" disableFocusRipple={true}>
              <div className="content">
                <label>
                  <GiExitDoor size={ICON_HEIGHT} />
                  <div>Home exit</div>
                </label>
              </div>
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }
}
export default Scenes;

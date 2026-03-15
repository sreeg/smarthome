import './switch.css';
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import sunFill from '@iconify/icons-eva/sun-fill';
import BulbOutline from '@iconify/icons-eva/bulb-outline';

const gateway = 'http://192.168.88.122:1880';

// Custom Brightness Slider with gradient
const BrightnessSlider = styled(Slider)({
  color: '#edc42f',
  height: 8,
  padding: '8px 0',
  '& .MuiSlider-track': {
    border: 'none',
    background: 'linear-gradient(90deg, #6b6b6b 0%, #ffe47a 100%)',
  },
  '& .MuiSlider-thumb': {
    height: 16,
    width: 16,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
});

// Custom Color Temp Slider with warm/cool gradient
const ColorTempSlider = styled(Slider)({
  color: '#52af77',
  height: 8,
  padding: '8px 0',
  '& .MuiSlider-track': {
    border: 'none',
    boxShadow: 'none', // Track color is inherited from background gradient
    backgroundColor: 'transparent',
  },
  '& .MuiSlider-rail': {
    opacity: 1,
    background: 'linear-gradient(90deg, #ff8b14 0%, #ffffff 50%, #c4d1ff 100%)',
    height: 8,
  },
  '& .MuiSlider-thumb': {
    height: 16,
    width: 16,
    backgroundColor: '#fff',
    border: '2px solid #bdbdbd',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
  },
});


const ColorAndBrightness = ({ cDefaultValue, bDefaultValue, sColor, sBrightness, stateHandler }) => {

  const [colorVal, setColorVal] = useState(cDefaultValue * 20 || 0);
  const [brightVal, setBrightVal] = useState(bDefaultValue * 20 || 0);

  const handleColorChange = (e, v) => {
    setColorVal(v);
  };

  const handleColorCommit = (e, v) => {
    fetch(`${gateway}/${sColor}/${v}`).then((response) => response.json());
    if (stateHandler) stateHandler(sColor, Math.round(v / 20));
  };

  const handleBrightnessChange = (e, v) => {
    setBrightVal(v);
  };

  const handleBrightnessCommit = (e, v) => {
    fetch(`${gateway}/${sBrightness}/${v}`).then((response) => response.json());
    if (stateHandler) stateHandler(sBrightness, Math.round(v / 20));
  };

  return (
    <Grid>
      <Card sx={{ minWidth: 280, mb: 1, borderRadius: '24px', boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '16px !important', bgcolor: 'background.paper' }}>
          
          {/* Main Controls Row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Brightness Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: '60px' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Bright
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {brightVal}%
                </Typography>
              </div>
              <Icon icon={sunFill} style={{ color: '#6b6b6b' }} width={16} />
              <BrightnessSlider 
                value={brightVal} 
                min={0} 
                max={100} 
                onChange={handleBrightnessChange} 
                onChangeCommitted={handleBrightnessCommit} 
                sx={{ mx: 1 }}
              />
              <Icon icon={sunFill} style={{ color: '#ffe47a' }} width={20} />
            </div>

            {/* Color Temperature Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: '60px' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Temp
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {colorVal}%
                </Typography>
              </div>
              <Icon icon={BulbOutline} style={{ color: '#ff8b14' }} width={18} />
              <ColorTempSlider 
                value={colorVal} 
                min={0} 
                max={100} 
                onChange={handleColorChange} 
                onChangeCommitted={handleColorCommit} 
                sx={{ mx: 1 }}
              />
              <Icon icon={BulbOutline} style={{ color: '#c4d1ff' }} width={18} />
            </div>

          </div>

        </CardContent>
      </Card>
    </Grid>
  );
};

export default ColorAndBrightness;

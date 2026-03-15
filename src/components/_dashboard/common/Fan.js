import './switch.css';
import React, { useState } from 'react';
import { mdiCeilingFan } from '@mdi/js';
import Icon from '@mdi/react';
import Slider from '@mui/material/Slider';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

const gateway = 'http://192.168.88.122:1880';

// Custom Fan Speed Slider dynamic to Theme
const FanSpeedSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 8,
  padding: '8px 0',
  '& .MuiSlider-track': {
    border: 'none',
    background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  },
  '& .MuiSlider-thumb': {
    height: 16,
    width: 16,
    backgroundColor: '#fff',
    border: `2px solid ${theme.palette.primary.main}`,
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: theme.palette.action.disabledBackground,
  },
}));

const Fan = ({ sVal, sFval, sID, sIDFS, sName, stateHandler }) => {

  const [fanSpeed, setFanSpeed] = useState(sFval * 20 || 0);
  const [isOn, setIsOn] = useState(sVal === 'ON');

  const handleSpeedChange = (e, v) => {
    setFanSpeed(v);
  };

  const handleSpeedCommit = (e, v) => {
    fetch(`${gateway}/${sIDFS}/${v}`).then((response) => response.json());
    if (stateHandler) stateHandler(sIDFS, Math.round(v / 20));
  };

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    const apiVal = newState ? 'ON' : 'OFF';
    fetch(`${gateway}/${sID}/${apiVal.toLowerCase()}`).then((response) => response.json());
    if (stateHandler) stateHandler(sID, apiVal);
  };

  return (
    <Card sx={{ minWidth: 280, mb: 1, width: '100%', borderRadius: '24px', boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, padding: '16px !important', bgcolor: 'background.paper' }}>
        
        {/* Compact Toggle Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '48px' }}>
          <IconButton 
            onClick={handleToggle}
            sx={{ 
              bgcolor: isOn ? 'primary.main' : 'action.selected',
              color: isOn ? 'primary.contrastText' : 'text.disabled',
              '&:hover': { bgcolor: isOn ? 'primary.dark' : 'action.hover' },
              transition: 'all 0.2s',
              width: 48,
              height: 48,
              mb: 0.5
            }}
          >
            <Icon path={mdiCeilingFan} size={1.2} />
          </IconButton>
          <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', fontSize: '0.65rem' }}>
            {sName}
          </Typography>
        </div>

        {/* Speed Slider Section */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Speed
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {fanSpeed}%
            </Typography>
          </div>
          <FanSpeedSlider 
            value={fanSpeed} 
            min={0} 
            max={100} 
            onChange={handleSpeedChange} 
            onChangeCommitted={handleSpeedCommit} 
          />
        </div>

      </CardContent>
    </Card>
  );
};

export default Fan;

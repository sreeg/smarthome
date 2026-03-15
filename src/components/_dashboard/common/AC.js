import './ac.css';
import React, { useState, useEffect } from 'react';
import Icon from '@mdi/react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { mdiAirConditioner, mdiMinus, mdiPlus, mdiPower } from '@mdi/js';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const gateway = 'http://192.168.88.122:1880';

const AC = ({ sVal, sID, sName, stateHandler }) => {
  const [onoff, setOnoff] = useState(sVal === 'on' || sVal === 'ON' ? 'ON' : 'OFF');
  const [temp, setTemp] = useState(24);

  // Keep state synced with props if polling updates them
  useEffect(() => {
    setOnoff(sVal === 'on' || sVal === 'ON' ? 'ON' : 'OFF');
  }, [sVal]);

  const handlePowerToggle = () => {
    const newVal = onoff === 'ON' ? 'OFF' : 'ON';
    setOnoff(newVal);
    if (stateHandler) stateHandler(sName, newVal);
    fetch(`${gateway}/${sName}/${newVal.toLowerCase()}`).then((response) => response.json());
  };

  const handleTempChange = (delta) => {
    let newTemp = temp + delta;
    if (newTemp > 26) newTemp = 26;
    if (newTemp < 18) newTemp = 18;
    
    setTemp(newTemp);
    fetch(`${gateway}/${sName}/${newTemp}`).then((response) => response.json());
  };

  const powerActive = onoff === 'ON';

  return (
    <Card sx={{ minWidth: 280, mb: 1, borderRadius: '24px', boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)', display: 'inline-block' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '16px !important', bgcolor: 'background.paper' }}>
        
        {/* Left Side: Icon & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon path={mdiAirConditioner} size={1.2} color="currentColor" />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {sName}
          </Typography>
        </div>

        {/* Center: Temperature Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '24px', marginRight: '24px' }}>
          <IconButton onClick={() => handleTempChange(-1)} disabled={temp <= 18} size="small" sx={{ bgcolor: 'action.hover' }}>
            <Icon path={mdiMinus} size={0.8} />
          </IconButton>
          
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', minWidth: '32px', textAlign: 'center' }}>
            {temp}°
          </Typography>
          
          <IconButton onClick={() => handleTempChange(1)} disabled={temp >= 26} size="small" sx={{ bgcolor: 'action.hover' }}>
            <Icon path={mdiPlus} size={0.8} />
          </IconButton>
        </div>

        {/* Right Side: Power Toggle */}
        <IconButton 
          onClick={handlePowerToggle}
          sx={{
            bgcolor: powerActive ? 'primary.main' : 'action.selected',
            color: powerActive ? 'primary.contrastText' : 'text.disabled',
            '&:hover': { bgcolor: powerActive ? 'primary.dark' : 'action.hover' },
            width: 48,
            height: 48,
            transition: 'all 0.2s'
          }}
        >
          <Icon path={mdiPower} size={1.2} />
        </IconButton>

      </CardContent>
    </Card>
  );
};

export default AC;

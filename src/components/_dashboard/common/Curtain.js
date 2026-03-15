import './switch.css';
import React, { useState, useEffect } from 'react';
import Icon from '@mdi/react';
import IconButton from '@mui/material/IconButton';
import { mdiCurtains, mdiCurtainsClosed, mdiPause } from '@mdi/js';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const gateway = 'http://192.168.88.122:1880';

const Curtain = ({ sVal, sID, sName, stateHandler }) => {
  const [alignment, setAlignment] = useState(sVal);

  // Sync state if props change (from polling)
  useEffect(() => {
    setAlignment(sVal);
  }, [sVal]);

  const handleAction = (val) => {
    setAlignment(val);
    if (stateHandler) stateHandler(sID, val);
    fetch(`${gateway}/${sID}/${val}`).then((response) => response.json());
  };

  const getButtonStyle = (val) => {
    const isActive = alignment === val;
    return {
      bgcolor: isActive ? 'primary.main' : 'action.selected',
      color: isActive ? 'primary.contrastText' : 'text.disabled',
      '&:hover': { bgcolor: isActive ? 'primary.dark' : 'action.hover' },
      transition: 'all 0.2s',
      width: 48,
      height: 48,
    };
  };

  return (
    <Card sx={{ mb: 1, borderRadius: '24px', boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)', display: 'inline-block' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, padding: '16px !important', bgcolor: 'background.paper' }}>
        
        {/* Top Side: Actions */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <IconButton onClick={() => handleAction('OPEN')} sx={getButtonStyle('OPEN')} title="Open">
            <Icon path={mdiCurtains} size={1.2} />
          </IconButton>
          
          <IconButton onClick={() => handleAction('STOP')} sx={getButtonStyle('STOP')} title="Stop">
            <Icon path={mdiPause} size={1.2} />
          </IconButton>
          
          <IconButton onClick={() => handleAction('CLOSE')} sx={getButtonStyle('CLOSE')} title="Close">
            <Icon path={mdiCurtainsClosed} size={1.2} />
          </IconButton>
        </div>

        {/* Bottom Side: Name */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'center' }}>
          {sName}
        </Typography>

      </CardContent>
    </Card>
  );
};

export default Curtain;

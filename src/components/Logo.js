import React from 'react';
import { Box, Image } from '@mantine/core';
import { useThemeMode } from '../theme';

export default function Logo({ width = 40, height = 40, style }) {
  const { mode } = useThemeMode();
  const filter = mode === 'dark' ? 'none' : 'invert(1)';
  
  return (
    <Box style={{ width, height, ...style }}>
      <Image 
        src="/static/shree.png" 
        w={width} 
        h={height} 
        style={{ filter }} 
        fallbackSrc="https://placehold.co/40x40?text=S"
      />
    </Box>
  );
}

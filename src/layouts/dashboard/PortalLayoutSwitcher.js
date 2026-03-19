import React from 'react';
import { usePortalTemplate } from '../../theme';
import ClassicLayout from './ClassicLayout';
import BentoLayout from './BentoLayout';
import ControlLayout from './ControlLayout';

export default function PortalLayoutSwitcher() {
  const { template } = usePortalTemplate();

  if (template === 'bento') {
    return <BentoLayout />;
  }
  
  if (template === 'control') {
    return <ControlLayout />;
  }

  return <ClassicLayout />;
}

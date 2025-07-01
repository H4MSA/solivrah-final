
import React from 'react';
import { AdvancedMascot } from './ui/advanced-mascot';

interface SolivrahMascotProps {
  mood?: 'happy' | 'thinking' | 'encouraging' | 'celebrating' | 'neutral' | 'excited' | 'focused';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showMessage?: boolean;
  message?: string;
  context?: 'quest' | 'ai-chat' | 'progress' | 'celebration';
}

export const SolivrahMascot: React.FC<SolivrahMascotProps> = (props) => {
  return <AdvancedMascot {...props} />;
};

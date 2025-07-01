
import React from 'react';
import { SoundManagerProvider } from './sound-manager';
import { PerformanceMonitor } from './performance-monitor';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <SoundManagerProvider>
      {children}
      <PerformanceMonitor showInDev={true} />
    </SoundManagerProvider>
  );
};

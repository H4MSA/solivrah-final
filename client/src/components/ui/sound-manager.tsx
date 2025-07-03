
import React, { createContext, useContext, useState, useCallback } from 'react';

interface SoundManagerContextType {
  isEnabled: boolean;
  toggleSound: () => void;
  playSound: (soundType: 'quest-complete' | 'milestone' | 'button-click' | 'streak') => void;
}

const SoundManagerContext = createContext<SoundManagerContextType | undefined>(undefined);

export const SoundManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem('soundEnabled') !== 'false';
  });

  const toggleSound = useCallback(() => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem('soundEnabled', newValue.toString());
  }, [isEnabled]);

  const playSound = useCallback((soundType: 'quest-complete' | 'milestone' | 'button-click' | 'streak') => {
    if (!isEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const frequencies = {
        'quest-complete': [523, 659, 784], // C5, E5, G5 - major chord
        'milestone': [440, 554, 659], // A4, C#5, E5
        'button-click': [800], // Simple click
        'streak': [392, 494, 587, 698] // G4, B4, D5, F5 - celebration
      };

      const freq = frequencies[soundType];
      
      freq.forEach((f, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = f;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + index * 0.1);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + index * 0.1 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.3);
        
        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + index * 0.1 + 0.3);
      });
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  }, [isEnabled]);

  return (
    <SoundManagerContext.Provider value={{ isEnabled, toggleSound, playSound }}>
      {children}
    </SoundManagerContext.Provider>
  );
};

export const useSoundManager = () => {
  const context = useContext(SoundManagerContext);
  if (!context) {
    throw new Error('useSoundManager must be used within a SoundManagerProvider');
  }
  return context;
};

import { useState, useEffect, useCallback } from 'react';
import { Howl } from 'howler';
import { prefersReducedMotion } from '@/lib/utils';

// Define sound types
export type SoundId = 
  | 'button-tap'
  | 'success'
  | 'error'
  | 'quest-complete'
  | 'ambient';

// Sound configuration
const SOUNDS: Record<SoundId, { src: string; volume: number; loop?: boolean }> = {
  'button-tap': { src: '/assets/audio/tap.mp3', volume: 0.35 },
  'success': { src: '/assets/audio/success.wav', volume: 0.45 },
  'error': { src: '/assets/audio/error.wav', volume: 0.4 },
  'quest-complete': { src: '/assets/audio/quest-complete.mp3', volume: 0.55 },
  'ambient': { src: '/assets/audio/ambient-loop.mp3', volume: 0.2, loop: true },
};

// Sound instances cache
const soundInstances: Partial<Record<SoundId, Howl>> = {};

// Initialize sound instances lazily
const getSound = (id: SoundId): Howl => {
  if (!soundInstances[id]) {
    const config = SOUNDS[id];
    soundInstances[id] = new Howl({
      src: [config.src],
      volume: config.volume,
      loop: config.loop || false,
      preload: id === 'ambient' ? false : true,
    });
  }
  return soundInstances[id]!;
};

// Last play timestamps to prevent rapid firing
const lastPlayed: Record<string, number> = {};
const DEBOUNCE_MS = 150;

/**
 * Hook for playing sounds in the application
 */
export function useSound() {
  const [muted, setMuted] = useState<boolean>(() => {
    // Check localStorage and respect reduced motion preference
    const savedMuted = localStorage.getItem('solivrah-sound-muted');
    return savedMuted ? JSON.parse(savedMuted) : prefersReducedMotion();
  });
  
  // Handle ambient sound
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  
  // Save mute preference
  useEffect(() => {
    localStorage.setItem('solivrah-sound-muted', JSON.stringify(muted));
  }, [muted]);
  
  // Play a sound if not muted and debounce rapid calls
  const play = useCallback((id: SoundId) => {
    if (muted) return;
    
    const now = Date.now();
    if (now - (lastPlayed[id] || 0) < DEBOUNCE_MS) return;
    
    lastPlayed[id] = now;
    const sound = getSound(id);
    sound.play();
  }, [muted]);
  
  // Toggle ambient sound
  const toggleAmbient = useCallback(() => {
    const ambient = getSound('ambient');
    
    if (ambientPlaying) {
      ambient.fade(ambient.volume(), 0, 1000);
      setTimeout(() => ambient.pause(), 1000);
      setAmbientPlaying(false);
    } else if (!muted) {
      ambient.volume(0);
      ambient.play();
      ambient.fade(0, SOUNDS.ambient.volume, 1000);
      setAmbientPlaying(true);
    }
  }, [ambientPlaying, muted]);
  
  // Stop ambient when muted changes
  useEffect(() => {
    if (muted && ambientPlaying) {
      const ambient = getSound('ambient');
      ambient.fade(ambient.volume(), 0, 1000);
      setTimeout(() => ambient.pause(), 1000);
      setAmbientPlaying(false);
    }
  }, [muted, ambientPlaying]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (ambientPlaying) {
        const ambient = getSound('ambient');
        ambient.stop();
      }
    };
  }, [ambientPlaying]);
  
  return {
    play,
    muted,
    setMuted,
    ambientPlaying,
    toggleAmbient,
  };
}

export default useSound; 
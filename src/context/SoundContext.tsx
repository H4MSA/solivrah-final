import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Howl } from "howler";

// Define sound types
type SoundType =
  | "button-tap"
  | "success"
  | "error"
  | "notification"
  | "achievement"
  | "swipe"
  | "toggle"
  | "complete";

// Sound context interface
interface SoundContextType {
  isSoundEnabled: boolean;
  isHapticsEnabled: boolean;
  volume: number;
  toggleSound: () => void;
  toggleHaptics: () => void;
  setVolume: (volume: number) => void;
  playSound: (sound: SoundType) => void;
  playWithHaptics: (sound: SoundType) => void;
}

// Create context with default values
const SoundContext = createContext<SoundContextType>({
  isSoundEnabled: true,
  isHapticsEnabled: true,
  volume: 0.5,
  toggleSound: () => {},
  toggleHaptics: () => {},
  setVolume: () => {},
  playSound: () => {},
  playWithHaptics: () => {},
});

// Sound provider props
interface SoundProviderProps {
  children: ReactNode;
}

// Sound files mapping
const soundFiles: Record<SoundType, string> = {
  "button-tap": "/sounds/button-tap.mp3",
  "success": "/sounds/success.mp3",
  "error": "/sounds/error.mp3",
  "notification": "/sounds/notification.mp3",
  "achievement": "/sounds/achievement.mp3",
  "swipe": "/sounds/swipe.mp3",
  "toggle": "/sounds/toggle.mp3",
  "complete": "/sounds/complete.mp3",
};

// Preloaded sound instances
const sounds: Record<SoundType, Howl> = {} as Record<SoundType, Howl>;

export function SoundProvider({ children }: SoundProviderProps) {
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    // Get from localStorage or default to true
    const saved = localStorage.getItem("solivrah-sound-enabled");
    return saved !== null ? saved === "true" : true;
  });
  
  const [isHapticsEnabled, setIsHapticsEnabled] = useState<boolean>(() => {
    // Get from localStorage or default to true
    const saved = localStorage.getItem("solivrah-haptics-enabled");
    return saved !== null ? saved === "true" : true;
  });
  
  const [volume, setVolumeState] = useState<number>(() => {
    // Get from localStorage or default to 0.5
    const saved = localStorage.getItem("solivrah-sound-volume");
    return saved !== null ? parseFloat(saved) : 0.5;
  });
  
  const [areSoundsLoaded, setAreSoundsLoaded] = useState<boolean>(false);
  
  // Initialize sound instances
  useEffect(() => {
    // Only load sounds in browser environment
    if (typeof window === "undefined") return;
    
    // Create sound instances
    Object.entries(soundFiles).forEach(([key, file]) => {
      sounds[key as SoundType] = new Howl({
        src: [file],
        volume: volume,
        preload: true,
      });
    });
    
    setAreSoundsLoaded(true);
    
    // Cleanup
    return () => {
      Object.values(sounds).forEach(sound => sound.unload());
    };
  }, []);
  
  // Update volume for all sounds when volume changes
  useEffect(() => {
    if (!areSoundsLoaded) return;
    
    Object.values(sounds).forEach(sound => {
      sound.volume(volume);
    });
    
    localStorage.setItem("solivrah-sound-volume", volume.toString());
  }, [volume, areSoundsLoaded]);
  
  // Save sound preference to localStorage
  useEffect(() => {
    localStorage.setItem("solivrah-sound-enabled", isSoundEnabled.toString());
  }, [isSoundEnabled]);
  
  // Save haptics preference to localStorage
  useEffect(() => {
    localStorage.setItem("solivrah-haptics-enabled", isHapticsEnabled.toString());
  }, [isHapticsEnabled]);
  
  // Toggle sound on/off
  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };
  
  // Toggle haptics on/off
  const toggleHaptics = () => {
    setIsHapticsEnabled(prev => !prev);
  };
  
  // Set volume (0.0 to 1.0)
  const setVolume = (newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  };
  
  // Play a sound
  const playSound = (sound: SoundType) => {
    if (!isSoundEnabled || !areSoundsLoaded) return;
    
    const soundInstance = sounds[sound];
    if (soundInstance) {
      soundInstance.play();
    }
  };
  
  // Trigger haptic feedback
  const triggerHaptics = () => {
    if (!isHapticsEnabled) return;
    
    // Check if vibration API is available
    if (navigator.vibrate) {
      navigator.vibrate(10); // Short vibration
    }
  };
  
  // Play sound with haptic feedback
  const playWithHaptics = (sound: SoundType) => {
    playSound(sound);
    triggerHaptics();
  };
  
  const value = {
    isSoundEnabled,
    isHapticsEnabled,
    volume,
    toggleSound,
    toggleHaptics,
    setVolume,
    playSound,
    playWithHaptics,
  };
  
  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
}

// Custom hook to use sound context
export function useAppSound() {
  const context = useContext(SoundContext);
  
  if (context === undefined) {
    throw new Error("useAppSound must be used within a SoundProvider");
  }
  
  return context;
} 

import React, { useEffect } from 'react';

interface MobileOptimizationProps {
  children: React.ReactNode;
}

export const MobileOptimization: React.FC<MobileOptimizationProps> = ({ children }) => {
  useEffect(() => {
    // Prevent bounce scrolling on iOS
    const preventBounce = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const scrollable = target.closest('[data-scrollable]');
      
      if (!scrollable) {
        e.preventDefault();
      }
    };

    // Optimize for 120Hz displays
    const optimizeFrameRate = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          document.documentElement.style.setProperty('scroll-behavior', 'smooth');
        });
      }
    };

    // Handle orientation changes
    const handleOrientationChange = () => {
      // Force reflow to fix viewport issues
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.style.height = '100vh';
        document.body.style.height = '100dvh';
      }, 100);
    };

    // Add event listeners
    document.addEventListener('touchmove', preventBounce, { passive: false });
    window.addEventListener('orientationchange', handleOrientationChange);
    
    optimizeFrameRate();

    return () => {
      document.removeEventListener('touchmove', preventBounce);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return (
    <div className="mobile-container">
      {children}
    </div>
  );
};

// Hook for mobile-specific optimizations
export const useMobileOptimization = () => {
  useEffect(() => {
    // Battery optimization - reduce animations on low battery
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        if (battery.level < 0.2) {
          document.body.classList.add('low-battery');
        }
      });
    }

    // Network optimization - detect connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection && connection.effectiveType === 'slow-2g') {
        document.body.classList.add('slow-connection');
      }
    }
  }, []);
};

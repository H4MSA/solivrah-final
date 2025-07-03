
import React, { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({
  children,
  className = '',
  speed = 0.1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let targetScrollTop = 0;
    let currentScrollTop = 0;
    let animationId: number;

    const smoothScroll = () => {
      currentScrollTop += (targetScrollTop - currentScrollTop) * speed;
      container.scrollTop = currentScrollTop;

      if (Math.abs(targetScrollTop - currentScrollTop) > 0.5) {
        animationId = requestAnimationFrame(smoothScroll);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetScrollTop = Math.max(0, Math.min(
        container.scrollHeight - container.clientHeight,
        targetScrollTop + e.deltaY
      ));
      smoothScroll();
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [speed]);

  return (
    <div ref={containerRef} className={className} style={{ overflow: 'hidden' }}>
      {children}
    </div>
  );
};

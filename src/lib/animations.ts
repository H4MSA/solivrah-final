
import { MotionProps } from "framer-motion";

export const glassHover = {
  initial: { scale: 1, y: 0 },
  whileHover: { 
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2 }
  }
};

export const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-4, 4, -4],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export const popIn = {
  initial: { scale: 0.95, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 30 }
  }
};

export const shimmerProps = {
  style: {
    backgroundImage: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.05), transparent)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2.5s infinite'
  }
};

export const get3DProps = (intensity: number = 1): MotionProps => ({
  whileHover: { 
    rotateX: 5 * intensity, 
    rotateY: 5 * intensity, 
    z: 5 * intensity,
    scale: 1 + (0.02 * intensity),
    transition: { duration: 0.2 }
  },
  style: {
    transformStyle: "preserve-3d" as "preserve-3d"
  }
});

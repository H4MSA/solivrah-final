import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  wrapperClassName?: string;
  blurPlaceholder?: boolean;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  loadingIndicator?: React.ReactNode;
  onLoadingComplete?: () => void;
  fallbackSrc?: string;
}

/**
 * An optimized image component with blur-up loading, lazy loading, and proper error handling
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  wrapperClassName,
  blurPlaceholder = true,
  aspectRatio,
  objectFit = 'cover',
  priority = false,
  loadingIndicator,
  onLoadingComplete,
  fallbackSrc,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Generate a blurred, low-quality placeholder image
  const getPlaceholderImage = () => {
    if (!blurPlaceholder) return undefined;
    
    // Return a tiny version of the image for blurring
    // For remote images, we could return a tiny placeholder data URI
    if (src.startsWith('data:')) return src;
    
    // If we have a fallbackSrc, use that instead of a generic placeholder
    if (fallbackSrc) return fallbackSrc;
    
    // Use a generic placeholder shape
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23cccccc" /%3E%3C/svg%3E';
  };
  
  // Reset loading state when src changes
  useEffect(() => {
    if (src !== currentSrc) {
      setIsLoading(true);
      setError(false);
      setCurrentSrc(src);
    }
  }, [src, currentSrc]);
  
  // Handle successful load
  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
    if (onLoadingComplete) {
      onLoadingComplete();
    }
  };
  
  // Handle load error
  const handleError = () => {
    setIsLoading(false);
    setError(true);
    
    // If we have a fallback image and haven't tried it yet, use it
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };
  
  // Get placeholder
  const placeholderSrc = getPlaceholderImage();
  
  // Define style object based on provided props
  const imageStyle: React.CSSProperties = {
    objectFit,
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
    aspectRatio: aspectRatio
  };
  
  // Check if we should use native lazy loading
  const shouldLazyLoad = !priority && 'loading' in HTMLImageElement.prototype;
  
  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-black/10',
        wrapperClassName
      )}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        aspectRatio
      }}
    >
      {/* Placeholder and loading indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm"
          >
            {loadingIndicator || (
              <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Blurred placeholder */}
      {placeholderSrc && isLoading && (
        <div 
          className="absolute inset-0 blur-lg scale-110" 
          style={{
            backgroundImage: `url(${placeholderSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      {/* Main image */}
      <img
        ref={imageRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={shouldLazyLoad ? 'lazy' : undefined}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          error ? 'invisible' : 'visible',
          className
        )}
        style={imageStyle}
        {...props}
      />
      
      {/* Error state */}
      {error && !fallbackSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="mt-2 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
}; 
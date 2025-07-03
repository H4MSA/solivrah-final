import { useState, useEffect, useRef, useMemo } from 'react';

interface VirtualItemMetrics {
  index: number;
  start: number;
  end: number;
  size: number;
  isMeasured: boolean;
}

interface VirtualListOptions<T> {
  items: T[];
  estimatedItemHeight: number;
  overscan?: number;
  getItemKey?: (item: T, index: number) => string | number;
}

interface VirtualListResult<T> {
  visibleItems: Array<{
    item: T;
    index: number;
    measureRef: (el: HTMLElement | null) => void;
  }>;
  containerProps: {
    ref: (el: HTMLElement | null) => void;
    style: {
      position: 'relative';
      height: string;
      width: '100%';
      overflow: 'auto';
    };
    onScroll: (e: React.UIEvent) => void;
  };
  itemProps: (index: number) => {
    style: {
      position: 'absolute';
      top: string;
      left: 0;
      width: '100%';
    };
    ['data-index']: number;
  };
  scrollToIndex: (index: number, options?: { align?: 'auto' | 'start' | 'center' | 'end'; behavior?: ScrollBehavior }) => void;
  totalHeight: number;
  isScrolling: boolean;
}

/**
 * A hook for rendering large lists efficiently by only rendering items visible in the viewport
 * 
 * @param options Configuration options for the virtual list
 * @returns Props and methods for implementing the virtual list
 */
export function useVirtualList<T>(options: VirtualListOptions<T>): VirtualListResult<T> {
  const { 
    items, 
    estimatedItemHeight, 
    overscan = 3,
    getItemKey = (_, index) => index
  } = options;
  
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollingTimerRef = useRef<number | null>(null);
  
  // Refs for DOM elements and measurement cache
  const containerRef = useRef<HTMLElement | null>(null);
  const itemsMetricsRef = useRef<Map<number | string, VirtualItemMetrics>>(new Map());
  const measurementCacheRef = useRef<Map<number, number>>(new Map());
  
  // Calculate the visible range based on current scroll position
  const { startIndex, endIndex, totalHeight } = useMemo(() => {
    if (items.length === 0 || containerHeight === 0) {
      return { startIndex: 0, endIndex: 0, totalHeight: 0 };
    }
    
    let totalHeight = 0;
    let startIndex = 0;
    let endIndex = 0;
    let currentOffset = 0;
    
    // Calculate total height and find visible items
    for (let i = 0; i < items.length; i++) {
      const key = getItemKey(items[i], i);
      const metrics = itemsMetricsRef.current.get(key);
      const height = metrics?.size || measurementCacheRef.current.get(i) || estimatedItemHeight;
      
      // Update total height
      totalHeight += height;
      
      // Calculate start index
      if (currentOffset + height < scrollTop && i < items.length - 1) {
        startIndex = i + 1;
      }
      
      // Calculate end index
      if (currentOffset <= scrollTop + containerHeight && endIndex <= i) {
        endIndex = i;
      }
      
      currentOffset += height;
    }
    
    // Apply overscan
    startIndex = Math.max(0, startIndex - overscan);
    endIndex = Math.min(items.length - 1, endIndex + overscan);
    
    return { startIndex, endIndex, totalHeight };
  }, [items, scrollTop, containerHeight, estimatedItemHeight, overscan, getItemKey]);
  
  // Get the list of visible items and their props
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, localIndex) => {
      const index = startIndex + localIndex;
      
      return {
        item,
        index,
        measureRef: (el: HTMLElement | null) => {
          if (el) {
            const height = el.offsetHeight;
            const key = getItemKey(item, index);
            
            // Store measurement
            measurementCacheRef.current.set(index, height);
            
            // Update metrics
            let start = 0;
            for (let i = 0; i < index; i++) {
              start += measurementCacheRef.current.get(i) || estimatedItemHeight;
            }
            
            itemsMetricsRef.current.set(key, {
              index,
              start,
              end: start + height,
              size: height,
              isMeasured: true
            });
          }
        }
      };
    });
  }, [items, startIndex, endIndex, estimatedItemHeight, getItemKey]);
  
  // Get the position for each item
  const getItemPosition = (index: number) => {
    let position = 0;
    for (let i = 0; i < index; i++) {
      position += measurementCacheRef.current.get(i) || estimatedItemHeight;
    }
    return position;
  };
  
  // Handle container resize
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver(entries => {
      const { height } = entries[0].contentRect;
      setContainerHeight(height);
    });
    
    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Handle scrolling
  const handleScroll = (e: React.UIEvent) => {
    const { scrollTop } = e.currentTarget as HTMLElement;
    setScrollTop(scrollTop);
    
    // Track scrolling state for scroll optimizations
    setIsScrolling(true);
    
    if (scrollingTimerRef.current !== null) {
      window.clearTimeout(scrollingTimerRef.current);
    }
    
    scrollingTimerRef.current = window.setTimeout(() => {
      setIsScrolling(false);
      scrollingTimerRef.current = null;
    }, 150);
  };
  
  // Scroll to specific index
  const scrollToIndex = (
    index: number, 
    options: { align?: 'auto' | 'start' | 'center' | 'end'; behavior?: ScrollBehavior } = {}
  ) => {
    if (!containerRef.current) return;
    
    const { align = 'auto', behavior = 'auto' } = options;
    const position = getItemPosition(index);
    const height = measurementCacheRef.current.get(index) || estimatedItemHeight;
    
    let scrollPosition: number;
    switch (align) {
      case 'start':
        scrollPosition = position;
        break;
      case 'center':
        scrollPosition = position - (containerHeight / 2) + (height / 2);
        break;
      case 'end':
        scrollPosition = position - containerHeight + height;
        break;
      case 'auto':
      default:
        if (position < scrollTop) {
          // Item is above visible area, scroll to start
          scrollPosition = position;
        } else if (position + height > scrollTop + containerHeight) {
          // Item is below visible area, scroll to end
          scrollPosition = position - containerHeight + height;
        } else {
          // Item is already visible, don't scroll
          return;
        }
    }
    
    containerRef.current.scrollTo({
      top: scrollPosition,
      behavior
    });
  };
  
  return {
    visibleItems,
    containerProps: {
      ref: (el) => { containerRef.current = el; },
      style: {
        position: 'relative',
        height: '100%',
        width: '100%',
        overflow: 'auto'
      },
      onScroll: handleScroll
    },
    itemProps: (index: number) => ({
      style: {
        position: 'absolute',
        top: `${getItemPosition(index)}px`,
        left: 0,
        width: '100%'
      },
      ['data-index']: index
    }),
    scrollToIndex,
    totalHeight,
    isScrolling
  };
} 
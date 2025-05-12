import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * A hook for memoizing expensive calculations with proper dependency tracking.
 * Unlike useMemo, this guarantees the value will only be recalculated when dependencies change.
 * 
 * @param calculator Function that performs the expensive calculation
 * @param dependencies Array of dependencies that should trigger recalculation
 * @returns The memoized calculation result
 */
export function useMemoized<T>(calculator: () => T, dependencies: React.DependencyList): T {
  // Use useRef to store the previous deps and result
  const previousDeps = useRef<React.DependencyList>([]);
  const previousResult = useRef<T | null>(null);
  
  // Check if dependencies have changed
  const depsChanged = previousDeps.current.length !== dependencies.length || 
    dependencies.some((dep, i) => !Object.is(dep, previousDeps.current[i]));
  
  // If deps changed or no previous result, calculate new result
  if (depsChanged || previousResult.current === null) {
    previousDeps.current = dependencies;
    previousResult.current = calculator();
  }
  
  return previousResult.current;
}

/**
 * Hook for deeply memoizing objects or arrays with structural comparison
 * This is useful for preventing unnecessary rerenders when using objects as props
 * 
 * @param value Object or array to memoize
 * @returns Memoized version of the value that only changes when the structure changes
 */
export function useDeepMemoized<T>(value: T): T {
  const [memoizedValue, setMemoizedValue] = useState<T>(value);
  const previousValueRef = useRef<T>(value);
  
  useEffect(() => {
    // Deep comparison function
    const isEqual = (a: any, b: any): boolean => {
      if (a === b) return true;
      
      if (
        typeof a !== 'object' || 
        typeof b !== 'object' || 
        a === null || 
        b === null
      ) {
        return a === b;
      }
      
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      
      if (keysA.length !== keysB.length) return false;
      
      return keysA.every(key => 
        Object.prototype.hasOwnProperty.call(b, key) && 
        isEqual(a[key], b[key])
      );
    };
    
    // Only update if deep comparison shows the value has changed
    if (!isEqual(value, previousValueRef.current)) {
      previousValueRef.current = value;
      setMemoizedValue(value);
    }
  }, [value]);
  
  return memoizedValue;
}

/**
 * Hook for creating stable callback functions that don't trigger rerenders,
 * but still capture the latest props and state
 * 
 * @param callback The callback function to memoize
 * @param dependencies Dependencies array that should trigger recreation of the callback
 * @returns A stable callback function
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T, 
  dependencies: React.DependencyList = []
): T {
  // Use ref to always hold the latest callback
  const callbackRef = useRef(callback);
  
  // Update ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Create a stable wrapper that calls the latest callback
  return useMemo(() => {
    return ((...args: any[]) => {
      return callbackRef.current(...args);
    }) as T;
  }, dependencies);
} 
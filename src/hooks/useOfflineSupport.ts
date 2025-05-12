
import { useState, useEffect, useCallback } from 'react';

// Types for offline operations
type OfflineOperation = {
  id: string;
  operationType: 'quest-completion' | 'mood-update' | 'profile-update';
  data: any;
  timestamp: number;
}

type OfflineSyncStatus = {
  isSyncing: boolean;
  lastSyncAttempt: number | null;
  lastSuccessfulSync: number | null;
  pendingOperations: number;
}

/**
 * Custom hook for handling offline operations and sync
 */
export function useOfflineSupport() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<OfflineSyncStatus>({
    isSyncing: false,
    lastSyncAttempt: null,
    lastSuccessfulSync: null,
    pendingOperations: 0
  });

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Attempt to sync when coming back online
      syncOfflineOperations();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for pending operations when the hook mounts
    checkPendingOperations();

    // Listen for message from service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_COMPLETED') {
          checkPendingOperations();
          setSyncStatus(prev => ({
            ...prev,
            isSyncing: false,
            lastSyncAttempt: Date.now(),
            lastSuccessfulSync: Date.now()
          }));
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for pending offline operations
  const checkPendingOperations = useCallback(async () => {
    try {
      const operations = await getPendingOperations();
      setSyncStatus(prev => ({
        ...prev,
        pendingOperations: operations.length
      }));
    } catch (error) {
      console.error('Failed to check pending operations:', error);
    }
  }, []);

  // Save an operation to be performed when back online
  const saveOfflineOperation = useCallback(async (
    operationType: OfflineOperation['operationType'],
    data: any
  ): Promise<string> => {
    const operation: OfflineOperation = {
      id: generateUniqueId(),
      operationType,
      data,
      timestamp: Date.now()
    };

    try {
      await saveOperation(operation);
      
      // Update pending count
      setSyncStatus(prev => ({
        ...prev,
        pendingOperations: prev.pendingOperations + 1
      }));

      // If we're online, attempt to sync immediately
      if (navigator.onLine) {
        requestSync();
      }

      return operation.id;
    } catch (error) {
      console.error('Failed to save offline operation:', error);
      throw error;
    }
  }, []);

  // Sync all pending operations
  const syncOfflineOperations = useCallback(async () => {
    if (!navigator.onLine || syncStatus.isSyncing) return;

    setSyncStatus(prev => ({
      ...prev,
      isSyncing: true,
      lastSyncAttempt: Date.now()
    }));

    // Request a sync via the service worker
    requestSync();
  }, [syncStatus.isSyncing]);

  // Helper function to request background sync
  const requestSync = useCallback(async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Check if the sync API is supported and available on the registration
        if (registration.sync && typeof registration.sync.register === 'function') {
          await registration.sync.register('offline-quest-completion');
          return true;
        }
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
    return false;
  }, []);

  // Helper function to generate unique ID
  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  // IndexedDB operations (simplified implementation)
  async function getPendingOperations(): Promise<OfflineOperation[]> {
    // In a real implementation, this would retrieve data from IndexedDB
    // For demo purposes, we'll check localStorage
    try {
      const storedOps = localStorage.getItem('offline_operations');
      if (storedOps) {
        return JSON.parse(storedOps);
      }
    } catch (e) {
      console.error('Error retrieving offline operations:', e);
    }
    return [];
  }

  async function saveOperation(operation: OfflineOperation): Promise<void> {
    // In a real implementation, this would save to IndexedDB
    // For demo purposes, we'll use localStorage
    try {
      const operations = await getPendingOperations();
      operations.push(operation);
      localStorage.setItem('offline_operations', JSON.stringify(operations));
    } catch (e) {
      console.error('Error saving offline operation:', e);
      throw e;
    }
  }

  return {
    isOnline,
    syncStatus,
    saveOfflineOperation,
    syncOfflineOperations,
    pendingOperationsCount: syncStatus.pendingOperations
  };
}

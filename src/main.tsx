
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import './index.css';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <App />
        <Toaster />
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>
);

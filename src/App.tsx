
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeBackground } from '@/components/ThemeBackground';
import TabNavigation from '@/components/TabNavigation';
import Welcome from '@/pages/Welcome';
import Index from '@/pages/Index';
import Social from '@/pages/Social';
import Survey from '@/pages/Survey';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeBackground />
      <div className="min-h-screen w-full dynamic-island-aware relative">
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/social" element={<Social />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/" element={<Index />} />
        </Routes>
        <TabNavigation />
      </div>
    </Router>
  );
}

export default App;

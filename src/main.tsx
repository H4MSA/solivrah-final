
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { SoundProvider } from "@/context/SoundContext";
import { Toaster } from "@/components/ui/toaster";
import { NetworkStatusIndicator } from "@/components/ui/network-status-indicator";
import { Layout } from "@/app/layout";

// Pages
import { HomePage } from "@/app/home";
import { QuestsPage } from "@/app/quests";
import { ProfilePage } from "@/app/profile";
import { CoachPage } from "@/app/coach";
import { CommunityPage } from "@/app/community";
import { HelpPage } from "@/app/help";
import { NotFoundPage } from "@/app/not-found";

// Styles
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <SoundProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/coach" element={<CoachPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
          
          {/* Global components */}
          <NetworkStatusIndicator />
          <Toaster />
        </BrowserRouter>
      </SoundProvider>
    </ThemeProvider>
  </React.StrictMode>
);

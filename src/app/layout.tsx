import React, { ReactNode } from "react";
import { TabNavigation } from "@/components/composite/TabNavigation";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  // Check if we should show the tab navigation
  // Don't show on auth pages, etc.
  const shouldShowTabs = ![
    "/login",
    "/signup",
    "/auth",
    "/onboarding",
    "/welcome",
  ].some(path => location.pathname.startsWith(path));
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      <main className="flex-1 pb-20">
        {children}
      </main>
      
      {shouldShowTabs && <TabNavigation />}
    </div>
  );
} 
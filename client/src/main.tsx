
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Coach from "./pages/Coach";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Quests from "./pages/Quests";
import Survey from "./pages/Survey";
import Help from "./pages/Help";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { AppProvider } from "./context/AppContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Switch>
          <Route path="/" component={Index} />
          <Route path="/home" component={Home} />
          <Route path="/auth" component={Auth} />
          <Route path="/auth/callback" component={AuthCallback} />
          <Route path="/coach" component={Coach} />
          <Route path="/community" component={Community} />
          <Route path="/profile" component={Profile} />
          <Route path="/quests" component={Quests} />
          <Route path="/survey" component={Survey} />
          <Route path="/help" component={Help} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  </StrictMode>,
);

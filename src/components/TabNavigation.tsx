import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ListChecks, Users, MessageCircle, User } from "lucide-react";

export const TabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto pb-safe">
      <div className="flex items-center justify-around p-4 bg-black/90 backdrop-blur-xl border-t border-white/10">
        <button onClick={() => navigate('/home')} className={`nav-item ${location.pathname === '/home' ? 'nav-item-active' : 'nav-item-inactive'}`}>
          <Home size={24} />
        </button>
        <button onClick={() => navigate('/quests')} className={`nav-item ${location.pathname === '/quests' ? 'nav-item-active' : 'nav-item-inactive'}`}>
          <ListChecks size={24} />
        </button>
        <button onClick={() => navigate('/coach')} className={`nav-item ${location.pathname === '/coach' ? 'nav-item-active' : 'nav-item-inactive'}`}>
          <MessageCircle size={24} />
        </button>
        <button onClick={() => navigate('/community')} className={`nav-item ${location.pathname === '/community' ? 'nav-item-active' : 'nav-item-inactive'}`}>
          <Users size={24} />
        </button>
        <button onClick={() => navigate('/profile')} className={`nav-item ${location.pathname === '/profile' ? 'nav-item-active' : 'nav-item-inactive'}`}>
          <User size={24} />
        </button>
      </div>
    </nav>
  );
};
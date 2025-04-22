import { useNavigate, useLocation } from "react-router-dom";
import { Home, ListChecks, Users, MessageCircle, User } from "lucide-react";

export function TabNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-around p-4 bg-black/90 backdrop-blur-xl border-t border-white/10">
          {[
            { path: '/home', icon: Home, label: 'Home' },
            { path: '/quests', icon: ListChecks, label: 'Quests' },
            { path: '/coach', icon: MessageCircle, label: 'Coach' },
            { path: '/community', icon: Users, label: 'Social' },
            { path: '/profile', icon: User, label: 'Profile' }
          ].map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all duration-300 ${
                isActive(path) 
                  ? 'text-white scale-110' 
                  : 'text-white/60 hover:text-white/90'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
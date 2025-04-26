
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";

export function TabNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Custom SVG icons for our unique app look
  const HomeIcon = ({ active }: { active: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M3 9.5L12 4L21 9.5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V9.5Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        strokeOpacity={active ? "1" : "0.6"}
        fill={active ? "rgba(255,255,255,0.03)" : "none"}
      />
      {active && <circle cx="12" cy="16" r="1" fill="currentColor" />}
    </svg>
  );

  const QuestsIcon = ({ active }: { active: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect 
        x="3" y="3" 
        width="18" height="18" 
        rx="2" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeOpacity={active ? "1" : "0.6"}
        fill={active ? "rgba(255,255,255,0.03)" : "none"}
      />
      <path 
        d="M9 14L11 16L15 10" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        strokeOpacity={active ? "1" : "0.6"}
      />
    </svg>
  );

  const CommunityIcon = ({ active }: { active: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="8" cy="8" 
        r="4" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeOpacity={active ? "1" : "0.6"}
        fill={active ? "rgba(255,255,255,0.03)" : "none"}
      />
      <circle 
        cx="16" cy="16" 
        r="4" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeOpacity={active ? "1" : "0.6"}
        fill={active ? "rgba(255,255,255,0.03)" : "none"}
      />
      <path 
        d="M15 9L9 15" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
        strokeOpacity={active ? "1" : "0.6"}
      />
    </svg>
  );

  const CoachIcon = ({ active }: { active: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        strokeOpacity={active ? "1" : "0.6"}
        fill={active ? "rgba(255,255,255,0.03)" : "none"}
      />
      {active && (
        <>
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="8" cy="12" r="1" fill="currentColor" />
          <circle cx="16" cy="12" r="1" fill="currentColor" />
        </>
      )}
    </svg>
  );

  const ProfileIcon = ({ active }: { active: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="12" cy="8" 
        r="4" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeOpacity={active ? "1" : "0.6"}
        fill={active ? "rgba(255,255,255,0.03)" : "none"}
      />
      <path 
        d="M20 19C20 16.2386 16.4183 14 12 14C7.58172 14 4 16.2386 4 19" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
        strokeOpacity={active ? "1" : "0.6"}
      />
    </svg>
  );

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="mx-auto max-w-lg">
        <GlassCard 
          variant="ultra-glass" 
          className="flex items-center justify-around py-4 px-6 mx-4 mb-4 rounded-2xl"
        >
          {[
            { path: '/home', icon: HomeIcon, label: 'Home' },
            { path: '/quests', icon: QuestsIcon, label: 'Quests' },
            { path: '/coach', icon: CoachIcon, label: 'Coach' },
            { path: '/community', icon: CommunityIcon, label: 'Social' },
            { path: '/profile', icon: ProfileIcon, label: 'Profile' }
          ].map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1.5 px-3 py-1 rounded-lg transition-all duration-300`}
            >
              <Icon active={isActive(path)} />
              <span className={`text-xs font-medium ${
                isActive(path) 
                  ? 'text-white' 
                  : 'text-white/60'
              }`}>{label}</span>

              {isActive(path) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-[62px] h-1 w-1 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </GlassCard>
      </div>
    </motion.nav>
  );
}

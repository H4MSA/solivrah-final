
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wallet, Home, Exchange, Markets, Profile } from "lucide-react";

// Icon mapping for easy changes/consistency
const NAV_ICONS = {
  home: Home,
  wallet: Wallet,
  exchange: Exchange,
  markets: Markets,
  profile: Profile,
};

const navItems = [
  { key: "home", label: "Home", path: "/home" },
  { key: "wallet", label: "Wallet", path: "/wallet" },
  { key: "exchange", label: "Exchange", path: "/exchange", center: true },
  { key: "markets", label: "Markets", path: "/markets" },
  { key: "profile", label: "Profile", path: "/profile" },
];

export const TabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-end pointer-events-none">
      <nav
        className="
          pointer-events-auto
          relative flex w-[97vw] max-w-[420px] mx-auto rounded-3xl bg-black/85 border border-white/15 
          shadow-2xl py-2 px-3 mb-3
          backdrop-blur-[16px] 
          before:absolute before:-top-5 before:left-1/2 before:-translate-x-1/2
          before:w-16 before:h-7 before:bg-transparent
          after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none
        "
        style={{ boxShadow: "0 6px 32px 0 rgba(0,0,0,.4)" }}
      >
        {navItems.map((item, idx) => {
          const Icon = NAV_ICONS[item.key as keyof typeof NAV_ICONS];
          const active = isActive(item.path);
          // Center floating button
          if (item.center) {
            return (
              <div key={item.key} className="flex-1 flex justify-center relative z-20">
                <button
                  onClick={() => navigate(item.path)}
                  className={`
                    group flex flex-col items-center justify-center
                    -mt-8 rounded-full w-16 h-16 bg-black border-4 border-white/10
                    shadow-xl transition-all duration-200 hover:scale-105 active:scale-95
                    relative
                  `}
                  style={{
                    boxShadow: active
                      ? "0 0 0 8px rgba(255,255,255,0.05),0 4px 32px rgba(58,61,71,.28)"
                      : "0 4px 16px rgba(0,0,0,.18)"
                  }}
                  aria-label={item.label}
                >
                  <span className={`flex items-center justify-center transition-all duration-200 
                    ${active
                      ? "bg-white text-black scale-105 shadow-lg"
                      : "bg-black text-white/80 shadow-none"
                    }
                    rounded-full w-11 h-11`}>
                    <Icon size={32} strokeWidth={2} className={active ? "scale-110" : ""} />
                  </span>
                </button>
              </div>
            )
          }
          // Side icons
          return (
            <div key={item.key} className={`flex-1 flex flex-col items-center justify-end z-10`}>
              <button
                onClick={() => navigate(item.path)}
                className={`group flex flex-col items-center px-1 pt-4 pb-1 transition-all
                  ${active ? "text-white font-medium" : "text-white/60"} 
                  rounded-xl hover:text-white hover:scale-105 active:scale-95 duration-200
                  focus:outline-none
                `}
                aria-label={item.label}
              >
                <Icon size={24} strokeWidth={2.1} />
                <span className={`text-[0.81rem] mt-1 tracking-wide
                  ${active ? "font-semibold" : "font-normal"}
                `}>{item.label}</span>
                {/* Active indicator for Profile, like green bar in reference */}
                {item.key === "profile" && active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-green-400/90 shadow-lg animate-fade-in" />
                )}
              </button>
            </div>
          )
        })}
      </nav>
    </div>
  );
};

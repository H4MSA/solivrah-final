
import React from "react";

export const ThemeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {/* Background base color - monochromatic gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-gray to-dark-gray"></div>
      
      {/* Subtle overlay for texture */}
      <div className="absolute inset-0 bg-black/5"></div>
    </div>
  );
};

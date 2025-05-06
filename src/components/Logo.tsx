
import React from "react";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = ""
}) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <div className="bg-black border border-white/80 rounded-md px-2 py-1">
        <p className="text-white font-bold text-lg tracking-wider">SOLIVRAH</p>
      </div>
    </div>
  );
};


import React from "react";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = ""
}) => {
  return (
    <div className={`${className} relative flex items-center justify-center`}>
      <img 
        src="/lovable-uploads/6d4f6130-d1ed-446d-a625-8598edecee49.png" 
        alt="Solivrah" 
        className="w-[210px] object-contain filter blur-[0.3px]" 
      />
    </div>
  );
};


import React from "react";

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <h1 className={`font-bold text-gradient ${className}`}>
      Solivrah
    </h1>
  );
};

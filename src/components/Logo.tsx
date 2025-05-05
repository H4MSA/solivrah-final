
import React from "react";
interface LogoProps {
  className?: string;
}
export const Logo: React.FC<LogoProps> = ({
  className = ""
}) => {
  return <div className={`${className} relative flex justify-center`}>
      <img src="/lovable-uploads/26f16ee1-32e9-459d-9f7e-533a4e0d8022.png" alt="Solivrah" className="h-12 object-contain" />
    </div>;
};

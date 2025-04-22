import React from "react";
import { useApp } from "@/context/AppContext";

export const ThemeBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Base background with subtle grid */}
      <div className="absolute inset-0 bg-[#0A0A0A] bg-grid-white/[0.02]"></div>

      {/* Subtle gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px] animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[100px] animate-float-reverse"></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:44px_44px]"></div>

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-70"></div>
    </div>
  );
};
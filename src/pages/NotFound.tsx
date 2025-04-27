
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ThemeBackground } from "@/components/ThemeBackground";
import { TabNavigation } from "@/components/TabNavigation";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen text-white">
      <ThemeBackground />
      
      <div className="flex flex-col items-center justify-center h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 blur-[80px] bg-white/10 rounded-full"></div>
              <h1 className="text-7xl font-bold relative z-10 text-gradient">404</h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-medium">Page not found</h2>
              <p className="text-white/70">
                The page you are looking for doesn't exist or has been moved.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Link 
                  to="/"
                  className="px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-all active:scale-95 backdrop-blur-sm"
                >
                  Go Home
                </Link>
                
                <Link 
                  to={-1 as any}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium rounded-xl hover:bg-white/15 transition-all active:scale-95"
                >
                  Go Back
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default NotFound;

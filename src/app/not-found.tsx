import React from "react";
import { motion } from "framer-motion";
import { useAppSound } from "@/context/SoundContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Home, ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  const { playWithHaptics } = useAppSound();
  const navigate = useNavigate();
  
  // Handle navigation back
  const handleGoBack = () => {
    playWithHaptics("button-tap");
    navigate(-1);
  };
  
  // Handle navigation to home
  const handleGoHome = () => {
    playWithHaptics("button-tap");
    navigate("/home");
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-background/80">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 text-center">
          <div className="mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                repeatDelay: 3 
              }}
              className="inline-block text-6xl"
            >
              🧭
            </motion.div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
          
          <p className="text-muted-foreground mb-6">
            Oops! It seems you've ventured into uncharted territory.
            The page you're looking for doesn't exist.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleGoBack}
            >
              <ArrowLeft size={16} />
              Go Back
            </Button>
            
            <Button
              className="gap-2"
              onClick={handleGoHome}
            >
              <Home size={16} />
              Return Home
            </Button>
          </div>
        </GlassCard>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </motion.div>
    </div>
  );
} 
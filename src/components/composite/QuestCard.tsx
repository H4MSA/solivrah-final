import React, { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppSound } from "@/context/SoundContext";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Award, ChevronRight } from "lucide-react";

interface QuestCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  dueDate?: string;
  estimatedTime?: string;
  rewards?: number;
  image?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * QuestCard - A card component for displaying quest information with 3D hover effects
 */
export function QuestCard({
  id,
  title,
  description,
  progress,
  category,
  difficulty,
  dueDate,
  estimatedTime,
  rewards = 0,
  image,
  onClick,
  className,
}: QuestCardProps) {
  const { playWithHaptics } = useAppSound();
  const [isHovered, setIsHovered] = useState(false);
  
  // 3D tilt effect values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform mouse movement to rotation
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);
  
  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    x.set(mouseX);
    y.set(mouseY);
  };
  
  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };
  
  // Get color based on difficulty
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-500";
      case "medium":
        return "bg-amber-500/20 text-amber-500";
      case "hard":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-primary/20 text-primary";
    }
  };
  
  // Get progress color
  const getProgressColor = () => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 40) return "bg-amber-500";
    return "bg-primary";
  };
  
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl overflow-hidden border border-white/10 bg-card/80 backdrop-blur-sm",
        "transition-all duration-300 transform-gpu will-change-transform",
        isHovered && "shadow-card-3d border-white/20",
        className
      )}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        playWithHaptics("button-tap");
        onClick?.();
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Card content with 3D effect */}
      <div className="p-5 relative" style={{ transform: "translateZ(20px)" }}>
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className={cn("font-medium", getDifficultyColor())}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
          
          <Badge variant="outline" className="bg-secondary/20 text-secondary">
            {category}
          </Badge>
        </div>
        
        {image && (
          <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
              loading="lazy" 
            />
          </div>
        )}
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>{estimatedTime || "10 min"}</span>
          </div>
          
          {dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays size={12} />
              <span>{dueDate}</span>
            </div>
          )}
          
          {rewards > 0 && (
            <div className="flex items-center gap-1 text-xs text-amber-500">
              <Award size={12} />
              <span>{rewards} XP</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Progress</span>
            <span className="text-xs font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className={cn("h-1.5", getProgressColor())} />
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                variant="ghost" 
                className="w-full justify-between border border-white/10 bg-black/40"
                onClick={(e) => {
                  e.stopPropagation();
                  playWithHaptics("button-tap");
                  onClick?.();
                }}
              >
                Continue Quest
                <ChevronRight size={16} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 
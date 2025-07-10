import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSound } from "@/context/SoundContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, ChevronLeft, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface HeaderSectionProps {
  title: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  showMenu?: boolean;
  onBackClick?: () => void;
  onMenuClick?: () => void;
}

export function HeaderSection({
  title,
  showBackButton = false,
  showSearch = true,
  showMenu = false,
  onBackClick,
  onMenuClick,
}: HeaderSectionProps) {
  const { playWithHaptics } = useAppSound();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Handle search toggle
  const handleSearchToggle = () => {
    playWithHaptics("button-tap");
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery("");
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      playWithHaptics("success");
      // TODO: Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };
  
  // Handle back button click
  const handleBackClick = () => {
    playWithHaptics("button-tap");
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };
  
  // Handle menu button click
  const handleMenuClick = () => {
    playWithHaptics("button-tap");
    if (onMenuClick) {
      onMenuClick();
    }
  };
  
  // Handle notification click
  const handleNotificationClick = () => {
    playWithHaptics("button-tap");
    // TODO: Implement notification functionality
    console.log("Notification clicked");
  };
  
  // Handle profile navigation
  const handleProfileClick = () => {
    playWithHaptics("button-tap");
    navigate("/profile");
  };
  
  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-background/70 border-b border-white/10">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left section: Back button or title */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBackClick}
              className="h-9 w-9"
            >
              <ChevronLeft size={20} />
            </Button>
          )}
          
          {showMenu && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleMenuClick}
              className="h-9 w-9"
            >
              <Menu size={20} />
            </Button>
          )}
          
          {!searchOpen && (
            <motion.h1 
              className="text-lg font-semibold"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {title}
            </motion.h1>
          )}
        </div>
        
        {/* Middle section: Search bar (when open) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              className="absolute left-0 right-0 px-4 flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSearchSubmit}
            >
              <Input
                placeholder="Search..."
                className="flex-1"
                value={searchQuery}
                onChange={handleSearchChange}
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon" 
                type="button"
                onClick={handleSearchToggle}
                className="h-9 w-9"
              >
                <X size={18} />
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
        
        {/* Right section: Action buttons */}
        <div className="flex items-center gap-2">
          {showSearch && !searchOpen && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSearchToggle}
              className="h-9 w-9"
            >
              <Search size={18} />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNotificationClick}
            className="h-9 w-9 relative"
          >
            <Bell size={18} />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
              3
            </Badge>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full overflow-hidden"
                onClick={() => playWithHaptics("button-tap")}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleProfileClick}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                playWithHaptics("button-tap");
                navigate("/settings");
              }}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                playWithHaptics("button-tap");
                navigate("/help");
              }}>
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                playWithHaptics("button-tap");
                // TODO: Implement logout functionality
                console.log("Logout clicked");
              }}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 
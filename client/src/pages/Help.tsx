import React from 'react';
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Help = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <GlassCard variant="dark" className="max-w-md w-full p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">Need Help?</h2>
        
        <p className="text-white/70">
          Welcome to the help section! Here you can find answers to common questions and guides on how to use Solivrah.
        </p>
        
        <div className="space-y-2">
          <h3 className="font-medium">Common Questions</h3>
          <ul className="list-disc list-inside text-white/60">
            <li>How do I complete a quest?</li>
            <li>What are streaks and how do they work?</li>
            <li>How can I change my profile settings?</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Guides</h3>
          <ul className="list-disc list-inside text-white/60">
            <li><Link to="#" className="hover:text-primary">Setting up your profile</Link></li>
            <li><Link to="#" className="hover:text-primary">Navigating the app</Link></li>
            <li><Link to="#" className="hover:text-primary">Understanding XP and levels</Link></li>
          </ul>
        </div>
        
        <Button asChild variant="secondary" className="w-full mt-4">
          <Link to="/home">Back to Home</Link>
        </Button>
      </GlassCard>
    </div>
  );
};

export default Help;

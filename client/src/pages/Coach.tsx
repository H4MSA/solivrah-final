import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, RefreshCw } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SolivrahBrandIcon } from "@/components/SolivrahIcons";

const Coach = () => {
  const [searchParams] = useSearchParams();
  const initialMessage = searchParams.get("message");
  const [input, setInput] = useState(initialMessage || "");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [affirmation, setAffirmation] = useState<string>("Tap to generate your daily affirmation");
  const [isGeneratingAffirmation, setIsGeneratingAffirmation] = useState(false);
  const { selectedTheme, session } = useApp();
  const { toast } = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (initialMessage) {
      sendMessage();
    }
  }, [initialMessage]);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`
        },
        body: JSON.stringify({
          message: userMessage,
          mood: selectedMood || "neutral"
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.reply, isUser: false }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting right now. Please try again in a moment.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAffirmation = async () => {
    if (isGeneratingAffirmation) return;
    
    setIsGeneratingAffirmation(true);
    try {
      const response = await fetch(`/api/affirmation?theme=${selectedTheme || "general"}`, {
        headers: {
          "Authorization": `Bearer ${session?.access_token || ""}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setAffirmation(data.affirmation);
      toast({
        title: "Affirmation Generated",
        description: "Start your day with positivity!",
      });
    } catch (error) {
      console.error("Error generating affirmation:", error);
      setAffirmation("You have the strength to overcome any challenge today.");
    } finally {
      setIsGeneratingAffirmation(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden">
      {/* Premium Monochromatic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/[0.015] rounded-full blur-2xl animate-float" />
      </div>
      
      {/* Header with Sophisticated Glass Effect */}
      <div className="relative z-10 px-4 py-6 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center">
              <SolivrahBrandIcon />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Your AI Coach</h1>
              <p className="text-xs text-white/60">Personalized guidance & support</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Daily Affirmation - Duolingo Inspired */}
      <div className="relative z-10 px-4 py-6 max-w-md mx-auto w-full">
        <GlassCard variant="duolingo" className="p-6 text-center">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-2">Daily Affirmation</h3>
            <div className="w-12 h-1 bg-gradient-to-r from-white/60 to-white/20 rounded-full mx-auto"></div>
          </div>
          
          <button 
            onClick={generateAffirmation}
            disabled={isGeneratingAffirmation}
            className="neo-button w-full p-4 mb-4 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              {isGeneratingAffirmation ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="font-medium">Generating wisdom...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span className="font-medium">Generate New Affirmation</span>
                </>
              )}
            </div>
          </button>
          
          <div className="glass p-4 rounded-xl bg-white/5">
            <p className="text-sm leading-relaxed text-white/90 italic">"{affirmation}"</p>
          </div>
        </GlassCard>
      </div>

      {/* Chat Messages with Enhanced Styling */}
      <div className="flex-grow px-4 py-6 overflow-y-auto space-y-4 max-w-md mx-auto w-full relative z-10">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="glass p-8 rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                <SolivrahBrandIcon />
              </div>
              <h3 className="text-lg font-bold mb-2">Start Your Conversation</h3>
              <p className="text-white/70 text-sm">Ask me anything! I'm here to help guide you on your journey.</p>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`flex items-start gap-3 ${message.isUser ? 'justify-end' : ''}`}>
            {!message.isUser && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center flex-shrink-0">
                <SolivrahBrandIcon />
              </div>
            )}
            <div className={`max-w-[80%] ${message.isUser ? 'order-first' : ''}`}>
              <GlassCard 
                variant={message.isUser ? "primary" : "ultra-glass"} 
                className={`p-4 ${message.isUser ? 'bg-white text-black' : ''}`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </GlassCard>
            </div>
            {message.isUser && (
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 rounded-full bg-white/60"></div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Enhanced Chat Input with Premium Styling */}
      <div className="sticky bottom-0 px-4 py-6 backdrop-blur-2xl border-t border-white/10 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="glass p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' ? sendMessage() : null}
                  className="w-full rounded-xl bg-white/5 border-white/20 text-white placeholder:text-white/50 pl-4 pr-4 py-3 focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                />
              </div>
              <button 
                onClick={sendMessage} 
                disabled={isLoading}
                className="neo-button p-3 rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all duration-300"
              >
                {isLoading ? (
                  <Send className="w-5 h-5 animate-pulse" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coach;

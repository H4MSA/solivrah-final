import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, RefreshCw, настроение } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { ThemeSelect } from "@/components/ThemeSelect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SolivrahBrandIcon } from "@/components/SolivrahIcons";
import { useAuth } from "@/context/AuthContext";

const Coach = () => {
  const [searchParams] = useSearchParams();
  const initialMessage = searchParams.get("message");
  const [input, setInput] = useState(initialMessage || "");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [affirmation, setAffirmation] = useState<string>("Tap to generate your daily affirmation");
  const [isGeneratingAffirmation, setIsGeneratingAffirmation] = useState(false);
  const { selectedTheme } = useApp();
  const { toast } = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);
	const { session } = useAuth();
  
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
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] text-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Your Coach</h1>
          <ThemeSelect />
        </div>
      </div>
      
      {/* Affirmation Section */}
      <div className="px-4 py-6">
        <GlassCard variant="dark" className="p-4 text-center">
          <button 
            onClick={generateAffirmation}
            disabled={isGeneratingAffirmation}
            className="flex items-center justify-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            {isGeneratingAffirmation ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Affirmation
              </>
            )}
          </button>
          <p className="text-sm mt-2">{affirmation}</p>
        </GlassCard>
      </div>

      {/* Mood Selection */}
      <div className="px-4 py-4">
        <GlassCard variant="dark" className="p-4">
          <h3 className="text-lg font-medium mb-3">How are you feeling today?</h3>
          <div className="flex justify-around">
            {["Happy", "Neutral", "Sad"].map(mood => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`p-3 rounded-full hover:bg-white/10 transition-colors ${selectedMood === mood ? 'bg-white/20' : ''}`}
              >
                {mood === "Happy" && "😊"}
                {mood === "Neutral" && "😐"}
                {mood === "Sad" && "😔"}
                <span className="block text-xs mt-1">{mood}</span>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow px-4 py-6 overflow-y-auto space-y-3">
        {messages.map((message, index) => (
          <div key={index} className={`flex items-start gap-3 ${message.isUser ? 'justify-end' : ''}`}>
            {!message.isUser && (
              <Avatar className="w-8 h-8">
                <AvatarImage src="mascot.png" />
                <AvatarFallback><SolivrahBrandIcon /></AvatarFallback>
              </Avatar>
            )}
            <GlassCard variant="dark" className={`p-3 rounded-lg max-w-[80%] ${message.isUser ? 'bg-primary/10 text-right' : 'bg-secondary/10'}`}>
              <p className="text-sm">{message.text}</p>
            </GlassCard>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Chat Input */}
      <div className="sticky bottom-0 px-4 py-5 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent backdrop-blur-sm border-t border-white/5">
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' ? sendMessage() : null}
            className="rounded-full bg-[#1A1A1A] border-white/10 text-white placeholder:text-white/50"
          />
          <Button onClick={sendMessage} disabled={isLoading} className="rounded-full p-3 bg-primary text-primary-foreground hover:bg-primary/90">
            {isLoading ? <Send className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Coach;

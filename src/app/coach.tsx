import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSound } from "@/context/SoundContext";
import { HeaderSection } from "@/components/composite/HeaderSection";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Mic, Image, PaperclipIcon, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

// Message types
interface Message {
  id: string;
  content: string;
  sender: "user" | "coach";
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "read";
  isTyping?: boolean;
}

// Sample messages
const SAMPLE_MESSAGES: Message[] = [
  {
    id: "1",
    content: "Hi Alex! How are you feeling today?",
    sender: "coach",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "2",
    content: "I'm feeling a bit stressed about work, but otherwise okay.",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
    status: "read",
  },
  {
    id: "3",
    content: "I understand. Work stress can be challenging. Have you tried any of the breathing exercises we discussed last time?",
    sender: "coach",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
  },
  {
    id: "4",
    content: "Yes, I did the 4-7-8 breathing technique yesterday and it helped a bit.",
    sender: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21), // 21 hours ago
    status: "read",
  },
  {
    id: "5",
    content: "That's great to hear! Consistent practice will help make it more effective over time. Would you like to explore some additional stress management techniques today?",
    sender: "coach",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
];

// Chat history by date
const CHAT_HISTORY = [
  { date: "Today", count: 2 },
  { date: "Yesterday", count: 3 },
  { date: "Monday", count: 5 },
  { date: "Last Week", count: 12 },
];

// Suggested prompts
const SUGGESTED_PROMPTS = [
  "I'm feeling anxious today",
  "Help me with meditation",
  "How can I improve my sleep?",
  "I need motivation to exercise",
];

export function CoachPage() {
  const { playWithHaptics } = useAppSound();
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isCoachTyping, setIsCoachTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isCoachTyping]);
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for grouping
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Group messages by date
  const groupedMessages = messages.reduce((groups: Record<string, Message[]>, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  // Handle send message
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    
    playWithHaptics("button-tap");
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    };
    
    setMessages([...messages, newUserMessage]);
    setInputValue("");
    
    // Simulate message status changes
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newUserMessage.id 
            ? { ...msg, status: "sent" } 
            : msg
        )
      );
    }, 500);
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newUserMessage.id 
            ? { ...msg, status: "delivered" } 
            : msg
        )
      );
    }, 1000);
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newUserMessage.id 
            ? { ...msg, status: "read" } 
            : msg
        )
      );
    }, 1500);
    
    // Simulate coach typing
    setTimeout(() => {
      setIsCoachTyping(true);
      
      // Simulate coach response after typing
      setTimeout(() => {
        setIsCoachTyping(false);
        
        // Add coach response
        const newCoachMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: getCoachResponse(inputValue),
          sender: "coach",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, newCoachMessage]);
        playWithHaptics("success");
      }, 2000 + Math.random() * 1000);
    }, 1000);
  };
  
  // Simple coach response logic
  const getCoachResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes("stress") || lowerCaseMessage.includes("anxious") || lowerCaseMessage.includes("anxiety")) {
      return "I understand that you're feeling stressed. Let's work on some relaxation techniques. Have you tried the 5-5-5 breathing exercise? Breathe in for 5 seconds, hold for 5 seconds, and exhale for 5 seconds.";
    } else if (lowerCaseMessage.includes("sleep") || lowerCaseMessage.includes("tired")) {
      return "Sleep is crucial for wellbeing. I recommend establishing a consistent sleep schedule and a calming bedtime routine. Would you like me to suggest some specific techniques to improve your sleep quality?";
    } else if (lowerCaseMessage.includes("exercise") || lowerCaseMessage.includes("workout")) {
      return "Exercise is a great way to improve both physical and mental health! Even a short 10-minute walk can boost your mood. Would you like me to help you create a simple exercise routine that fits your schedule?";
    } else if (lowerCaseMessage.includes("meditation") || lowerCaseMessage.includes("mindful")) {
      return "Meditation is an excellent practice for mental clarity. Let's start with a simple 5-minute mindfulness exercise. Focus on your breath, and when your mind wanders, gently bring your attention back to your breathing.";
    } else {
      return "Thank you for sharing that with me. How can I best support you today? Would you like to explore some wellness techniques or talk more about what's on your mind?";
    }
  };
  
  // Handle suggested prompt click
  const handleSuggestedPrompt = (prompt: string) => {
    playWithHaptics("button-tap");
    setInputValue(prompt);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };
  
  return (
    <div className="flex flex-col h-screen">
      <HeaderSection 
        title="Coach" 
        showSearch={false}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex justify-center">
                <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                  {date}
                </Badge>
              </div>
              
              {dateMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex gap-2 max-w-[80%]">
                    {message.sender === "coach" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="Coach" />
                        <AvatarFallback>CO</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="flex flex-col">
                      <GlassCard 
                        variant={message.sender === "user" ? "default" : "subtle"}
                        className={`p-3 ${message.sender === "user" ? "bg-primary/10" : "bg-card/80"}`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </GlassCard>
                      
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <span>{formatTime(message.timestamp)}</span>
                        
                        {message.sender === "user" && message.status && (
                          <span className="ml-2">
                            {message.status === "sending" && "Sending..."}
                            {message.status === "sent" && "Sent"}
                            {message.status === "delivered" && "Delivered"}
                            {message.status === "read" && "Read"}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {message.sender === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="You" />
                        <AvatarFallback>ME</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
          
          {/* Coach typing indicator */}
          {isCoachTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Coach" />
                  <AvatarFallback>CO</AvatarFallback>
                </Avatar>
                
                <GlassCard variant="subtle" className="p-3">
                  <div className="flex items-center gap-1">
                    <motion.div 
                      className="h-2 w-2 bg-primary rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                    <motion.div 
                      className="h-2 w-2 bg-primary rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
                    />
                    <motion.div 
                      className="h-2 w-2 bg-primary rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.6 }}
                    />
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
          
          {/* For auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Suggested prompts */}
        <div className="px-4 py-2 overflow-x-auto flex gap-2 no-scrollbar">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => handleSuggestedPrompt(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
        
        {/* Message input */}
        <div className="p-4 border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Drawer>
              <DrawerTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => playWithHaptics("button-tap")}
                >
                  <Clock size={18} />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-semibold">Chat History</h3>
                  <div className="space-y-2">
                    {CHAT_HISTORY.map((item) => (
                      <div 
                        key={item.date} 
                        className="flex justify-between items-center p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => playWithHaptics("button-tap")}
                      >
                        <span>{item.date}</span>
                        <Badge variant="outline">{item.count} messages</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
            
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={() => playWithHaptics("button-tap")}
            >
              <PaperclipIcon size={18} />
            </Button>
            
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={() => playWithHaptics("button-tap")}
            >
              <Mic size={18} />
            </Button>
            
            <Button 
              type="submit" 
              size="icon"
              disabled={inputValue.trim() === ""}
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 
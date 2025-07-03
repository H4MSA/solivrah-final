import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Download, RefreshCw } from "lucide-react";
import { GlassCard } from "@/components/common/GlassCard";

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export default function Coach() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useApp();
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const userId = user?.id;
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use the coach feature.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const userMessage = message;
    setMessage("");
    
    // Add user message to chat
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: userMessage,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Mock AI response for now
      const botResponse = {
        id: (Date.now() + 1).toString(),
        content: "I understand you're working on your personal development journey. That's wonderful! What specific area would you like to focus on today?",
        isBot: true,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const exportChat = () => {
    const userId = user?.id;
    if (!userId) {
      toast({
        title: "Authentication Required", 
        description: "Please log in to export chat history.",
        variant: "destructive"
      });
      return;
    }

    const chatContent = messages.map(msg => {
      const sender = msg.isBot ? "Coach" : "You";
      return `${sender}: ${msg.content} (${msg.timestamp.toLocaleString()})`;
    }).join('\n');

    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-export-${new Date().toISOString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    // Scroll to bottom on new messages
    chatContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  return (
    <div className="container relative pb-20">
      <div className="px-4 py-6">
        <GlassCard>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Your Personal Coach</h1>
              <Button variant="secondary" onClick={exportChat}>
                <Download size={16} className="mr-2" />
                Export Chat
              </Button>
            </div>
            
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.isBot ? 'flex-row' : 'flex-row-reverse text-right'}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={msg.isBot ? "/images/bot-avatar.png" : user?.user_metadata?.avatar_url} />
                    <AvatarFallback>{msg.isBot ? "AI" : user?.user_metadata?.name?.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex flex-col">
                    <p className="text-sm text-white/70">
                      {msg.isBot ? "Coach" : "You"}
                    </p>
                    <GlassCard className="bg-black/70 border-white/10 p-3 rounded-md">
                      {msg.content}
                    </GlassCard>
                    <p className="text-xs text-white/40 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/images/bot-avatar.png" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  
                  <GlassCard className="bg-black/70 border-white/10 p-3 rounded-md">
                    Thinking...
                  </GlassCard>
                </div>
              )}
              
              <div ref={chatContainerRef} />
            </div>
            
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Ask your coach anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
              />
              <Button onClick={sendMessage} disabled={isLoading}>
                {isLoading ? <RefreshCw className="animate-spin" /> : <Send />}
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

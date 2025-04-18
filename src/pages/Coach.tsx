
import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { TabNavigation } from "@/components/TabNavigation";
import { FiSend, FiMic, FiUser } from "react-icons/fi";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id?: string;
  sender: "user" | "ai";
  text: string;
  timestamp?: string;
}

// Interface for Supabase chat_history table records
interface ChatHistoryRecord {
  id: string;
  message: string;
  response: string;
  theme: string;
  timestamp: string;
  user_id: string | null;
}

const Coach = () => {
  const { selectedTheme } = useApp();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: `Hi, I'm your AI Coach for ${selectedTheme}. How can I help you today?` },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .eq('theme', selectedTheme)
          .order('timestamp', { ascending: true });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Convert database records to Message type
          const formattedMessages: Message[] = [];
          
          // Process each record from the database
          data.forEach((record: ChatHistoryRecord) => {
            // Add user message
            formattedMessages.push({
              id: `${record.id}-user`,
              sender: "user",
              text: record.message,
              timestamp: record.timestamp
            });
            
            // Add AI response
            formattedMessages.push({
              id: `${record.id}-ai`,
              sender: "ai",
              text: record.response,
              timestamp: record.timestamp
            });
          });
          
          setMessages(prevMessages => {
            // Preserve the welcome message and add the history
            return [prevMessages[0], ...formattedMessages];
          });
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    
    loadMessages();
  }, [selectedTheme]);
  
  const handleSend = async () => {
    if (input.trim() === "") return;
    
    const userMessage: Message = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let aiResponse = "";
      if (selectedTheme === "Discipline") {
        aiResponse = "Consistency is key to building discipline. Remember that small actions repeated daily lead to significant results over time. What specific habit are you working on right now?";
      } else if (selectedTheme === "Focus") {
        aiResponse = "To improve focus, try eliminating distractions from your environment. The ability to concentrate deeply is becoming increasingly rare and valuable. How is your current focus environment?";
      } else if (selectedTheme === "Resilience") {
        aiResponse = "Resilience grows through challenges. Each setback is an opportunity to build mental strength. What specific challenge are you facing that I can help with?";
      } else {
        aiResponse = "Creativity flourishes when you give yourself permission to experiment without judgment. What creative ideas are you exploring currently?";
      }
      
      const aiMessageObj: Message = { sender: "ai", text: aiResponse };
      setMessages(prev => [...prev, aiMessageObj]);
      
      // Save the conversation to Supabase
      await saveMessageToSupabase(input, aiResponse);
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages(prev => [...prev, { sender: "ai", text: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveMessageToSupabase = async (userMessage: string, aiResponse: string) => {
    try {
      const { error } = await supabase.from('chat_history').insert([
        { 
          message: userMessage, 
          response: aiResponse,
          theme: selectedTheme 
        }
      ]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };
  
  return (
    <div className="min-h-screen pb-20 flex flex-col">
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">AI Coach</h1>
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <FiUser className="text-white" />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`${
                message.sender === "user" 
                  ? "ml-auto bg-primary/20" 
                  : "mr-auto bg-secondary/30"
              } p-3 rounded-xl max-w-[80%] animate-fade-in`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          ))}
          
          {isLoading && (
            <div className="mr-auto bg-secondary/30 p-3 rounded-xl max-w-[80%] animate-fade-in">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-muted rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-muted rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-muted rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="sticky bottom-20 left-0 right-0 p-4 bg-background z-10">
        <div className="flex items-center gap-2 glass rounded-full p-2 pr-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-transparent border-none outline-none text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
          />
          <button 
            className="bg-primary rounded-full p-2 text-primary-foreground"
            onClick={handleSend}
            disabled={isLoading}
          >
            <FiSend />
          </button>
        </div>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Coach;

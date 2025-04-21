
import React, { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Send, User, ArrowLeft } from "lucide-react";
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
  const { selectedTheme, user } = useApp();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: `Hi, I'm your AI Coach for ${selectedTheme || 'personal development'}. How can I help you today?` },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadMessages = async () => {
      try {
        if (!user) return; // Only load messages if user is logged in
        
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
  }, [selectedTheme, user]);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSend = async () => {
    if (input.trim() === "") return;
    
    const userMessage: Message = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let aiResponse = "";
      
      // Generate a more dynamic and personalized response based on the theme and user input
      const userInput = input.toLowerCase();
      
      if (selectedTheme === "Discipline" || !selectedTheme) {
        if (userInput.includes("struggle") || userInput.includes("hard") || userInput.includes("difficult")) {
          aiResponse = "It's normal to struggle with building discipline. Remember that small steps consistently taken add up over time. What specific aspect are you finding most challenging?";
        } else if (userInput.includes("morning") || userInput.includes("wake up")) {
          aiResponse = "Morning routines are powerful for building discipline. Try setting your alarm 15 minutes earlier each day and use that time for something you enjoy - this creates a positive association with waking up.";
        } else if (userInput.includes("procrastinate") || userInput.includes("procrastination")) {
          aiResponse = "Procrastination is often emotional, not logical. Try breaking tasks into tiny steps and just commit to the first one. What task are you currently putting off?";
        } else {
          aiResponse = "Building discipline is about consistency rather than intensity. What specific habit are you trying to develop right now?";
        }
      } else if (selectedTheme === "Focus") {
        if (userInput.includes("distract") || userInput.includes("attention")) {
          aiResponse = "Our attention is constantly being pulled in different directions. Have you tried time-blocking or the Pomodoro technique (25 minutes of focus followed by a 5-minute break)?";
        } else if (userInput.includes("phone") || userInput.includes("social media")) {
          aiResponse = "Digital distractions are powerful. Try putting your phone in another room while working, or use apps that temporarily block distracting websites.";
        } else {
          aiResponse = "Deep focus is a skill that takes practice. Start with short sessions and gradually increase the duration. What's your current focus environment like?";
        }
      } else if (selectedTheme === "Resilience") {
        if (userInput.includes("fail") || userInput.includes("mistake")) {
          aiResponse = "Failures are feedback, not endpoints. Every successful person has a history of failures behind them. What specific situation are you dealing with?";
        } else if (userInput.includes("stress") || userInput.includes("overwhelm")) {
          aiResponse = "When feeling overwhelmed, focus on what you can control. Even small actions can help restore a sense of agency. What's one small thing you could do today?";
        } else {
          aiResponse = "Resilience grows through challenges. Each setback is an opportunity to build mental strength. What specific challenge are you facing that I can help with?";
        }
      } else {
        if (userInput.includes("idea") || userInput.includes("stuck")) {
          aiResponse = "Creative blocks happen to everyone. Try changing your environment or approaching the problem from a completely different angle. What are you working on?";
        } else if (userInput.includes("inspire") || userInput.includes("motivation")) {
          aiResponse = "Inspiration often comes from combining different ideas or experiences. Try exposing yourself to content outside your usual interests. What's something new you could explore?";
        } else {
          aiResponse = "Creativity flourishes when you give yourself permission to experiment without judgment. What creative ideas are you exploring currently?";
        }
      }
      
      const aiMessageObj: Message = { sender: "ai", text: aiResponse };
      setMessages(prev => [...prev, aiMessageObj]);
      
      // Save the conversation to Supabase if user is logged in
      if (user) {
        await saveMessageToSupabase(input, aiResponse);
      }
      
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
          theme: selectedTheme || 'General'
        }
      ]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="min-h-screen pb-24 flex flex-col">
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">AI Coach</h1>
          <div className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center border border-white/5">
            <User className="text-white h-5 w-5" />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-4 chat-container">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`${
                message.sender === "user" 
                  ? "ml-auto bg-[#222222] text-white" 
                  : "mr-auto bg-[#121212] text-white"
              } p-4 rounded-xl max-w-[80%] animate-fade-in shadow-sm border border-white/5`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          ))}
          
          {isLoading && (
            <div className="mr-auto bg-[#121212] p-4 rounded-xl max-w-[80%] animate-fade-in border border-white/5">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="fixed left-0 right-0 bottom-[72px] p-4 bg-black/90 backdrop-blur-md z-10 mx-auto max-w-[390px]">
        <div className="flex items-center gap-2 bg-[#121212] rounded-full p-1 pr-2 border border-white/10">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your question..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white px-4 py-3"
            disabled={isLoading}
          />
          <button 
            className="bg-white text-black rounded-full p-2.5 hover:bg-white/90 transition-colors"
            onClick={handleSend}
            disabled={isLoading}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coach;

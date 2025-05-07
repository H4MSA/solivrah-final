
import React, { useState, useEffect, useRef } from "react";
import { Send, User, Smile, Meh, Frown, ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { AIService } from "@/services/AIService";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import type { Database } from "@/integrations/supabase/types";

interface Message {
  id?: string;
  sender: "user" | "ai";
  text: string;
  timestamp?: string;
  error?: boolean;
}

const Coach = () => {
  const { selectedTheme, user } = useApp();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: `Hi, I'm your AI Coach for ${selectedTheme || 'personal development'}. How can I help you today?` },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>("neutral");
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const aiService = new AIService();

  useEffect(() => {
    scrollToBottom();
    
    // Load chat history if the user is logged in
    if (user?.id) {
      loadChatHistory();
    }
    
    // Save current mood to localStorage for affirmation context
    localStorage.setItem("currentMood", selectedMood);
  }, [user?.id, selectedMood]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('message, response, timestamp')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform to our message format and add to state (oldest first)
        const historicalMessages: Message[] = [];
        data.reverse().forEach(item => {
          historicalMessages.push({ sender: "user", text: item.message });
          historicalMessages.push({ sender: "ai", text: item.response });
        });
        
        setMessages(prev => [
          prev[0], // Keep the greeting
          ...historicalMessages
        ]);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getConversationHistory = (): string => {
    // Get the last 5 message pairs to provide as context
    const contextMessages = messages
      .filter(m => !m.error)
      .slice(-10)
      .map(m => `${m.sender === "user" ? "User" : "Coach"}: ${m.text}`)
      .join("\n");
    
    return contextMessages;
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get user profile data for context
      const { data: profileData } = user?.id ? await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle() : { data: null };
        
      const userProfile = {
        theme: selectedTheme,
        ...(profileData || {})
      };
      
      // Get conversation history for context
      const conversationContext = getConversationHistory();
      
      // Call AI service for coaching response
      const aiResponse = await aiService.generateCoachingReply(
        input,
        selectedMood,
        conversationContext,
        userProfile
      );

      // Add AI response to messages
      const aiMessage: Message = { 
        sender: "ai", 
        text: aiResponse,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Save to database if user is logged in
      if (user?.id) {
        await saveMessageToSupabase(input, aiResponse);
      }
      
      // Show toast on insightful responses (randomly, to avoid too many notifications)
      if (Math.random() > 0.7) {
        toast({
          title: "Coach insight",
          description: "Your coach has provided a valuable insight",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages(prev => [...prev, { 
        sender: "ai", 
        text: "I'm having trouble connecting right now. Please try again later.",
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMessageToSupabase = async (userMessage: string, aiResponse: string) => {
    try {
      if (!user?.id) return;
      const { error } = await supabase
        .from("chat_history")
        .insert([{
          message: userMessage,
          response: aiResponse,
          theme: selectedTheme || "General",
          user_id: user.id,
          timestamp: new Date().toISOString()
        } as Database["public"]["Tables"]["chat_history"]["Insert"]]);

      if (error) {
        console.error('Error saving message:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error saving message:', error);
      // Continue even if saving fails
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy':
        return <Smile className="text-amber-400" />;
      case 'sad':
        return <Frown className="text-blue-400" />;
      case 'neutral':
      default:
        return <Meh className="text-white/70" />;
    }
  };
  
  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div className="min-h-screen pb-24 flex flex-col bg-gradient-to-b from-black to-[#0F0F1A]">
      <motion.div 
        className="p-6 flex-shrink-0 border-b border-white/10 backdrop-blur-md bg-black/70 z-10 sticky top-0"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">AI Coach</h1>
          <div className="flex items-center gap-2">
            <motion.button 
              onClick={() => setShowMoodSelector(!showMoodSelector)}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#121212] hover:bg-[#1A1A1A] border border-white/10 transition-all duration-300 text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Mood</span>
              {getMoodIcon(selectedMood)}
              {showMoodSelector ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </motion.button>
            
            <motion.div 
              className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-white/10 hover:border-white/20 transition-all hover:bg-[#222222]"
              whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="text-white h-5 w-5" />
            </motion.div>
          </div>
        </div>

        {showMoodSelector && (
          <motion.div 
            className="absolute right-6 mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl p-2 shadow-xl backdrop-blur-lg z-20"
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="grid grid-cols-3 gap-2">
              <motion.button 
                onClick={() => {
                  setSelectedMood('happy');
                  setShowMoodSelector(false);
                }}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                  selectedMood === 'happy' 
                    ? 'bg-[#222222] border border-white/15 shadow-inner' 
                    : 'hover:bg-[#222222]/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Smile size={22} className="text-amber-400 mb-1" />
                <span className="text-xs font-medium">Happy</span>
              </motion.button>
              
              <motion.button 
                onClick={() => {
                  setSelectedMood('neutral');
                  setShowMoodSelector(false);
                }}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                  selectedMood === 'neutral' 
                    ? 'bg-[#222222] border border-white/15 shadow-inner' 
                    : 'hover:bg-[#222222]/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Meh size={22} className="text-white mb-1" />
                <span className="text-xs font-medium">Neutral</span>
              </motion.button>
              
              <motion.button 
                onClick={() => {
                  setSelectedMood('sad');
                  setShowMoodSelector(false);
                }}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                  selectedMood === 'sad' 
                    ? 'bg-[#222222] border border-white/15 shadow-inner' 
                    : 'hover:bg-[#222222]/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Frown size={22} className="text-blue-400 mb-1" />
                <span className="text-xs font-medium">Sad</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="flex-1 overflow-y-auto px-6 pb-4 chat-container">
        <div className="space-y-4 py-4">
          {messages.map((message, index) => (
            <motion.div 
              key={index}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              className={`${
                message.sender === "user" 
                  ? "ml-auto bg-gradient-to-br from-[#333333] to-[#222222] text-white" 
                  : "mr-auto bg-gradient-to-br from-[#1A1A1A] to-[#121212] text-white"
              } p-4 rounded-xl max-w-[80%] shadow-lg border ${
                message.sender === "user" 
                  ? "border-white/10" 
                  : message.error 
                    ? "border-red-500/20" 
                    : "border-white/5"
              }`}
              style={{ 
                boxShadow: message.sender === "user" 
                  ? "0 4px 15px rgba(255,255,255,0.05)" 
                  : "0 4px 15px rgba(255,255,255,0.02)" 
              }}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div 
              className="mr-auto bg-[#121212] p-4 rounded-xl max-w-[80%] border border-white/5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-400/60 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-400/60 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-purple-400/60 rounded-full animate-pulse delay-300"></div>
                </div>
                <span className="text-sm text-white/50">AI is thinking...</span>
              </div>
            </motion.div>
          )}
          
          {messages.some(m => m.error) && (
            <motion.div 
              className="mx-auto my-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-red-400">
                There was an error connecting to the AI. Please try again.
              </p>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <motion.div 
        className="fixed left-0 right-0 bottom-[72px] p-4 bg-black/90 backdrop-blur-lg z-10 mx-auto max-w-[430px]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="flex items-center gap-2 bg-gradient-to-br from-[#121212] to-[#1A1A1A] rounded-full p-1 pr-2 border border-white/10 hover:border-white/20 transition-all shadow-lg">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white px-4 py-3"
            disabled={isLoading}
          />
          <motion.button 
            className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-2.5 transition-all ${
              input.trim() ? 'hover:opacity-90 active:scale-95' : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={16} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Coach;

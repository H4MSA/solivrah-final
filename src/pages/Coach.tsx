
import React, { useState, useEffect, useRef } from "react";
import { Send, User, Smile, Meh, Frown, ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateSystemPrompt = () => {
    return `You are an AI life coach specializing in ${selectedTheme || 'personal development'}. 
    Your responses should be encouraging, practical, and tailored to the user's needs.
    Keep responses concise and actionable.`;
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const messages = [{
        role: "system",
        content: generateSystemPrompt()
      }, {
        role: "user",
        content: input
      }];

      const response = await fetch('http://0.0.0.0:5000/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.id || 'anonymous',
          message: input,
          mood: selectedMood || 'neutral'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      const aiMessage: Message = { sender: "ai", text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);

      if (user) {
        await saveMessageToSupabase(input, aiResponse);
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

  return (
    <div className="min-h-screen pb-24 flex flex-col bg-black">
      <div className="p-6 flex-shrink-0 border-b border-white/10 backdrop-blur-md bg-black/70 z-10 sticky top-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-gradient">AI Coach</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowMoodSelector(!showMoodSelector)}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#121212] hover:bg-[#1A1A1A] border border-white/10 transition-all duration-300 text-sm"
            >
              <span>Mood</span>
              {getMoodIcon(selectedMood)}
              {showMoodSelector ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            
            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-white/10 hover:border-white/20 transition-all hover:bg-[#222222]">
              <User className="text-white h-5 w-5" />
            </div>
          </div>
        </div>

        {showMoodSelector && (
          <div className="absolute right-6 mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl p-2 shadow-xl backdrop-blur-lg z-20 transform origin-top animate-fade-in">
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => {
                  setSelectedMood('happy');
                  setShowMoodSelector(false);
                }}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                  selectedMood === 'happy' 
                    ? 'bg-[#222222] border border-white/15' 
                    : 'hover:bg-[#222222]/50'
                }`}
              >
                <Smile size={22} className="text-amber-400 mb-1" />
                <span className="text-xs font-medium">Happy</span>
              </button>
              
              <button 
                onClick={() => {
                  setSelectedMood('neutral');
                  setShowMoodSelector(false);
                }}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                  selectedMood === 'neutral' 
                    ? 'bg-[#222222] border border-white/15' 
                    : 'hover:bg-[#222222]/50'
                }`}
              >
                <Meh size={22} className="text-white mb-1" />
                <span className="text-xs font-medium">Neutral</span>
              </button>
              
              <button 
                onClick={() => {
                  setSelectedMood('sad');
                  setShowMoodSelector(false);
                }}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                  selectedMood === 'sad' 
                    ? 'bg-[#222222] border border-white/15' 
                    : 'hover:bg-[#222222]/50'
                }`}
              >
                <Frown size={22} className="text-blue-400 mb-1" />
                <span className="text-xs font-medium">Sad</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-28 chat-container">
        <div className="space-y-4 py-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`${
                message.sender === "user" 
                  ? "ml-auto bg-[#222222] text-white" 
                  : "mr-auto bg-[#121212] text-white"
              } p-4 rounded-xl max-w-[80%] animate-fade-in shadow-sm border ${
                message.sender === "user" 
                  ? "border-white/10" 
                  : message.error 
                    ? "border-red-500/20" 
                    : "border-white/5"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          ))}

          {isLoading && (
            <div className="mr-auto bg-[#121212] p-4 rounded-xl max-w-[80%] animate-fade-in border border-white/5">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-300"></div>
                </div>
                <span className="text-sm text-white/50">AI is thinking...</span>
              </div>
            </div>
          )}
          
          {messages.some(m => m.error) && (
            <div className="mx-auto my-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">
                There was an error connecting to the AI. Please try again.
              </p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed left-0 right-0 bottom-[72px] p-4 bg-black/90 backdrop-blur-lg z-10 mx-auto max-w-[430px]">
        <div className="flex items-center gap-2 bg-[#121212] rounded-full p-1 pr-2 border border-white/10 hover:border-white/20 transition-all shadow-lg">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white px-4 py-3"
            disabled={isLoading}
          />
          <button 
            className={`bg-white text-black rounded-full p-2.5 transition-all ${
              input.trim() ? 'hover:bg-white/90 active:scale-95' : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
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

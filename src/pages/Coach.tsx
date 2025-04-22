import React, { useState, useEffect, useRef } from "react";
import { Send, User } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id?: string;
  sender: "user" | "ai";
  text: string;
  timestamp?: string;
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

      const OPENROUTER_API_KEY = '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';
      const response = await fetch('http://0.0.0.0:5000/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Solivrah Quest Forge'
        },
        body: JSON.stringify({
          model: "meta/llama-4-scout:free",
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      const aiMessage: Message = { sender: "ai", text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);

      // Save to chat history if user is logged in
      if (user) {
        await saveMessageToSupabase(input, aiResponse);
      }

    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages(prev => [...prev, { 
        sender: "ai", 
        text: "I'm having trouble connecting right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMessageToSupabase = async (userMessage: string, aiResponse: string) => {
    try {
      const { error } = await supabase.from('chat_history').insert([{
        message: userMessage,
        response: aiResponse,
        theme: selectedTheme || 'General',
        user_id: user?.id,
        timestamp: new Date().toISOString()
      }]);

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
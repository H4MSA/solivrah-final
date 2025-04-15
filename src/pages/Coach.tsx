
import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { TabNavigation } from "@/components/TabNavigation";
import { FiSend, FiUser } from "react-icons/fi";

const Coach = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi, I'm your AI Coach. How can I help you today?" },
  ]);
  
  const handleSend = () => {
    if (input.trim() === "") return;
    
    // Add user message
    setMessages(prev => [...prev, { sender: "user", text: input }]);
    
    // Simulate AI response (would connect to backend in real app)
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          sender: "ai", 
          text: "I'm here to support your journey. Remember that consistency is key to building good habits." 
        }
      ]);
    }, 1000);
    
    setInput("");
  };
  
  return (
    <div className="min-h-screen pb-20">
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-medium">AI Coach</h1>
        
        <div className="space-y-4 mb-16">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`${
                message.sender === "user" 
                  ? "ml-auto bg-primary/20" 
                  : "mr-auto bg-secondary/30"
              } p-3 rounded-xl max-w-[80%]`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="fixed bottom-20 left-0 right-0 p-4">
        <div className="flex items-center gap-2 glass rounded-full p-2 pr-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-transparent border-none outline-none text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button 
            className="bg-primary rounded-full p-2 text-primary-foreground"
            onClick={handleSend}
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

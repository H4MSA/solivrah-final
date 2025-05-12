import React, { useState, useEffect, useRef } from "react";
import { Send, User, Smile, Meh, Frown, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { AIService } from "@/services/AIService";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ChatHistoryDrawer } from "@/components/coach/ChatHistoryDrawer";
import { SafeAreaLayout } from '../App';

interface Message {
  id?: string;
  sender: "user" | "ai";
  text: string;
  timestamp?: string;
  error?: boolean;
}

const CHAT_HISTORY_KEY = 'ai_coach_chat_history';

const Coach = () => {
  const { selectedTheme, user } = useApp();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: `Hi, I'm your AI Coach for ${selectedTheme || 'personal development'}. How can I help you today?` },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>("neutral");
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const aiService = new AIService();

  // Load messages from local storage on initial load
  useEffect(() => {
    const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      } catch (error) {
        setError("Failed to load chat history.");
      }
    }
  }, []);

  // Save messages to local storage whenever they change
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (input.trim() === "") return;
    setError(null);
    const userMessage: Message = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const conversationContext = messages
        .filter(m => !m.error)
        .slice(-10)
        .map(m => `${m.sender === "user" ? "User" : "Coach"}: ${m.text}`)
        .join("\n");
      const aiResponse = await aiService.generateCoachingReply(
        input,
        selectedMood,
        conversationContext,
        { theme: selectedTheme }
      );
      setMessages(prev => [...prev, { sender: "ai", text: aiResponse, timestamp: new Date().toISOString() }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "ai", text: "I'm having trouble connecting right now. Please try again later.", error: true }]);
      setError("AI service is currently unavailable.");
    } finally {
      setIsLoading(false);
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
      case 'happy': return <Smile className="text-amber-400" />;
      case 'sad': return <Frown className="text-blue-400" />;
      case 'neutral':
      default: return <Meh className="text-white/70" />;
    }
  };

  // Animation variants
  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  // --- UI ---
  return (
    <SafeAreaLayout withBottomNav={true}>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#181818]/95 border-b border-white/10 flex items-center justify-between px-4 py-3" style={{backdropFilter: 'blur(8px)'}}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Open chat history"
          >
            <Clock size={20} />
          </button>
          <span className="font-bold text-lg text-white">AI Coach</span>
          <span className="ml-2 px-2 py-1 rounded bg-white/10 text-xs text-white/70 capitalize">{selectedTheme}</span>
        </div>
        <button
          onClick={() => setShowMoodSelector(true)}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#222222] hover:bg-[#333333] border border-white/10 transition-all duration-300 text-sm"
          aria-label="Select mood"
        >
          <span>Mood</span>
          {getMoodIcon(selectedMood)}
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-2 py-4" style={{background: 'var(--color-bg)'}}>
        <div className="max-w-[430px] mx-auto space-y-3">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`w-fit max-w-[85%] ${message.sender === "user" ? "ml-auto" : "mr-auto"}`}
              >
                <div className={`rounded-xl px-4 py-2 shadow-md border text-sm leading-relaxed whitespace-pre-wrap ${
                  message.sender === "user"
                    ? "bg-[#222222] text-white border-white/10"
                    : message.error
                      ? "bg-red-500/10 text-red-300 border-red-500/20"
                      : "bg-[#1A1A1A] text-white border-white/10"
                }`}>
                  {message.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex items-center gap-2 text-white/70 text-xs animate-pulse">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
              AI is thinking...
            </div>
          )}
          {error && (
            <div className="text-xs text-red-400 mt-2">{error}</div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Bar */}
      <footer className="fixed left-0 right-0 bottom-0 z-30 px-4 pb-safe bg-gradient-to-t from-black/90 via-black/80 to-transparent pt-4" style={{backdropFilter: 'blur(8px)'}}>
        <div className="max-w-[430px] mx-auto flex items-center gap-2 rounded-full border border-white/10 bg-[#181818]/90 shadow-lg p-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white px-4 py-2"
            disabled={isLoading}
            aria-label="Type your message"
          />
          <button
            className={`bg-white text-black rounded-full p-2 transition-all ${input.trim() ? 'hover:bg-white/90 active:scale-95' : 'opacity-50 cursor-not-allowed'}`}
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </footer>

      {/* Mood Selector Modal */}
      <AnimatePresence>
        {showMoodSelector && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMoodSelector(false)}
          >
            <motion.div
              className="bg-[#181818] border border-white/10 rounded-xl p-6 shadow-xl flex flex-col gap-4 min-w-[260px]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="font-semibold text-white mb-2">How are you feeling?</div>
              <div className="flex gap-3">
                <button
                  className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${selectedMood === 'happy' ? 'bg-[#222222] border border-white/15 shadow-inner' : 'hover:bg-[#222222]/50'}`}
                  onClick={() => { setSelectedMood('happy'); setShowMoodSelector(false); }}
                >
                  <Smile size={28} className="text-amber-400 mb-1" />
                  <span className="text-xs font-medium">Happy</span>
                </button>
                <button
                  className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${selectedMood === 'neutral' ? 'bg-[#222222] border border-white/15 shadow-inner' : 'hover:bg-[#222222]/50'}`}
                  onClick={() => { setSelectedMood('neutral'); setShowMoodSelector(false); }}
                >
                  <Meh size={28} className="text-white mb-1" />
                  <span className="text-xs font-medium">Neutral</span>
                </button>
                <button
                  className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${selectedMood === 'sad' ? 'bg-[#222222] border border-white/15 shadow-inner' : 'hover:bg-[#222222]/50'}`}
                  onClick={() => { setSelectedMood('sad'); setShowMoodSelector(false); }}
                >
                  <Frown size={28} className="text-blue-400 mb-1" />
                  <span className="text-xs font-medium">Sad</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat History Drawer (if you want to keep it) */}
      <ChatHistoryDrawer isOpen={showHistory} onClose={() => setShowHistory(false)} historyItems={[]} onSelectChat={() => {}} />
    </SafeAreaLayout>
  );
};

export default Coach;
